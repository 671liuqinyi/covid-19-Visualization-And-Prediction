import torch
import os
import numpy as np
import pandas as pd
from tqdm import tqdm
import seaborn as sns
from pylab import rcParams
import matplotlib.pyplot as plt
from matplotlib import rc
from sklearn.preprocessing import MinMaxScaler
from pandas.plotting import register_matplotlib_converters
from torch import nn, optim
import json
import traceback
import pymysql


sns.set(style='whitegrid', palette='muted', font_scale=1.2)

HAPPY_COLORS_PALETTE = ["#01BEFE", "#FFDD00", "#FF7D00", "#FF006D", "#93D30C", "#8F00FF"]

sns.set_palette(sns.color_palette(HAPPY_COLORS_PALETTE))

rcParams['figure.figsize'] = 14, 6
register_matplotlib_converters()

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
torch.manual_seed(RANDOM_SEED)


# 导入数据
df = pd.read_csv('InLand.csv')
df.head()


# 检查缺省值
df.isnull().sum().sum()

# 获取每日病例
daily_cases = df.sum(axis=0)
daily_cases.index = pd.to_datetime(daily_cases.index)
daily_cases.head()

plt.plot(daily_cases)
plt.title("Daily cases")
plt.show()
# print(daily_cases.shape)
# 848个数据


#划分数据集
test_data_size = 172

train_data = daily_cases[:-test_data_size]
test_data = daily_cases[-test_data_size:]

#缩放数据到0-1，提升训练速度
scaler = MinMaxScaler()
scaler = scaler.fit(np.expand_dims(train_data, axis=1))

train_data = scaler.transform(np.expand_dims(train_data, axis=1))
test_data = scaler.transform(np.expand_dims(test_data, axis=1))

#设置更小的训练单元，时间窗口为7
def create_sequences(data, seq_length):
    xs = []
    ys = []

    for i in range(len(data) - seq_length - 1):
        x = data[i:(i + seq_length)]
        y = data[i + seq_length]
        xs.append(x)
        ys.append(y)

    return np.array(xs), np.array(ys)


seq_length = 7
X_train, y_train = create_sequences(train_data, seq_length)
X_test, y_test = create_sequences(test_data, seq_length)

X_train = torch.from_numpy(X_train).float()
y_train = torch.from_numpy(y_train).float()

X_test = torch.from_numpy(X_test).float()
y_test = torch.from_numpy(y_test).float()

# print(X_train.shape)
#
# print(X_train[:2])
#
# print(y_train.shape)
#
# print(y_train[:2])
#
# print(train_data[:10])


#建立模型
class CoronaVirusPredictor(nn.Module):
    #构造函数，初始化所有辅助数据并创建层
    def __init__(self, n_features, n_hidden, seq_len, n_layers=2):
        super(CoronaVirusPredictor, self).__init__()

        self.n_hidden = n_hidden
        self.seq_len = seq_len
        self.n_layers = n_layers

        self.lstm = nn.LSTM(
            input_size=n_features,
            hidden_size=n_hidden,
            num_layers=n_layers,
            dropout=0.5
        )

        self.linear = nn.Linear(in_features=n_hidden, out_features=1)
    #使用无状态 LSTM，因此我们需要在每个示例之后重置状态
    def reset_hidden_state(self):
        self.hidden = (
            torch.zeros(self.n_layers, self.seq_len, self.n_hidden),
            torch.zeros(self.n_layers, self.seq_len, self.n_hidden)
        )
    #获取序列，一次将所有序列通过 LSTM 层。我们采用最后一个时间步的输出并将其传递给我们的线性层以获得预测
    def forward(self, sequences):
        lstm_out, self.hidden = self.lstm(
            sequences.view(len(sequences), self.seq_len, -1),
            self.hidden
        )
        last_time_step = \
            lstm_out.view(self.seq_len, len(sequences), self.n_hidden)[-1]
        y_pred = self.linear(last_time_step)
        return y_pred
#为模型训练创造辅助函数
def train_model(
        model,
        train_data,
        train_labels,
        test_data=None,
        test_labels=None
):
    loss_fn = torch.nn.MSELoss(reduction='sum')

    optimiser = torch.optim.Adam(model.parameters(), lr=1e-3)
    num_epochs = 100

    train_hist = np.zeros(num_epochs)
    test_hist = np.zeros(num_epochs)

    for t in range(num_epochs):
        model.reset_hidden_state()
        y_pred = model(X_train)
        loss = loss_fn(y_pred.float(), y_train)
        if test_data is not None:
            with torch.no_grad():
                y_test_pred = model(X_test)
                test_loss = loss_fn(y_test_pred.float(), y_test)
            test_hist[t] = test_loss.item()

            if t % 10 == 0:
                print(f'Epoch {t} train loss: {loss.item()} test loss: {test_loss.item()}')
        elif t % 10 == 0:
            print(f'Epoch {t} train loss: {loss.item()}')

        train_hist[t] = loss.item()
        optimiser.zero_grad()
        loss.backward()
        optimiser.step()

    return model.eval(), train_hist, test_hist
#隐藏层的状态在每个epoch开始时被重置。不使用批量的数据，模型可以一次看到每个样本。使用均方误差来测量训练和测试误差，并将两者都记录下来
#创建模型实例进行训练
model = CoronaVirusPredictor(
  n_features=1,
  n_hidden=512,
  seq_len=seq_length,
  n_layers=2
)
model, train_hist, test_hist = train_model(
  model,
  X_train,
  y_train,
  X_test,
  y_test
)
#观察训练误差
plt.plot(train_hist, label="Training loss")
plt.plot(test_hist, label="Test loss")
plt.ylim((0, 100))
plt.legend()
plt.show()
#滑动时间窗口，将预测值作为接下来预测的输入
with torch.no_grad():
    test_seq = X_test[:1]
    preds = []
    for _ in range(len(X_test)):
        y_test_pred = model(test_seq)
        pred = torch.flatten(y_test_pred).item()
        preds.append(pred)
        new_seq = test_seq.numpy().flatten()
        new_seq = np.append(new_seq, [pred])
        new_seq = new_seq[1:]
        test_seq = torch.as_tensor(new_seq
                   ).view(1, seq_length, 1).float()
#缩放数据，恢复原始值
true_cases = scaler.inverse_transform(
    np.expand_dims(y_test.flatten().numpy(), axis=0)
).flatten()

predicted_cases = scaler.inverse_transform(
    np.expand_dims(preds, axis=0)
).flatten()
#绘制图像，比较预测结果
plt.plot(
    daily_cases.index[:len(train_data)],
    scaler.inverse_transform(train_data).flatten(),
    label='Historical Daily Cases')

plt.plot(
    daily_cases.index[len(train_data):len(train_data) + len(true_cases)],
    true_cases,
    label='Real Daily Cases')

plt.plot(
    daily_cases.index[len(train_data):len(train_data) + len(true_cases)],
    predicted_cases,
    label='Predicted Daily Cases')

plt.legend()

plt.show()
#正式预测
#缩放数据
scaler = MinMaxScaler()

scaler = scaler.fit(np.expand_dims(daily_cases, axis=1))
all_data = scaler.transform(np.expand_dims(daily_cases, axis=1))
#训练集
X_all, y_all = create_sequences(all_data, seq_length)

X_all = torch.from_numpy(X_all).float()
y_all = torch.from_numpy(y_all).float()
#辅助函数
model = CoronaVirusPredictor(
    n_features=1,
    n_hidden=512,
    seq_len=seq_length,
    n_layers=2
)
model, train_hist, _ = train_model(model, X_all, y_all)
#预测天数
DAYS_TO_PREDICT = 14
#滑动窗口
with torch.no_grad():
    test_seq = X_all[:1]
    preds = []
    for _ in range(DAYS_TO_PREDICT):
        y_test_pred = model(test_seq)
        pred = torch.flatten(y_test_pred).item()
        preds.append(pred)
        new_seq = test_seq.numpy().flatten()
        new_seq = np.append(new_seq, [pred])
        new_seq = new_seq[1:]
        test_seq = torch.as_tensor(new_seq).view(1, seq_length, 1).float()
#缩放数据，恢复原始值
predicted_cases = scaler.inverse_transform(
  np.expand_dims(preds, axis=0)
).flatten()
#绘制图像
predicted_index = pd.date_range(
    start=daily_cases.index[-1],
    periods=DAYS_TO_PREDICT + 1,
    closed='right'
)

predicted_cases = pd.Series(
    data=predicted_cases,
    index=predicted_index
)

plt.plot(predicted_cases, label='Predicted Daily Cases')

plt.legend()
plt.show()

plt.plot(daily_cases, label='Historical Daily Cases')
plt.plot(predicted_cases, label='Predicted Daily Cases')
plt.legend()
plt.show()