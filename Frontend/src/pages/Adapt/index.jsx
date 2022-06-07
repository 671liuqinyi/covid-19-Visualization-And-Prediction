import React from "react";

class Adapt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        margin: 0,
        height: "100vh",
        overflow: "hidden"
      },
      body: {
        width: "1920px",
        height: "937px",
      },
    };
  }
  adaptation = () => {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    const l = 1920 / 937;
    const width = h * l;
    const margin = (w - width) / 2 < 0 ? 0 : (w - width) / 2;
    const scale = h / 937;

    this.setState(() => ({
      center: {
        margin: `0 ${margin}px`,
        height: "100vh",
        overflow: "hidden"
      },
      body: {
        transform: `scale(${scale}, ${scale})`,
        width: "1920px",
        height: "937px",
        transformOrigin: "0 0",
        transition: "all 0.3s linear",
      },
    }));
  };
  componentDidMount() {
    this.adaptation();
    window.addEventListener("resize", this.adaptation);
  }

  render() {
    const { children } = this.props
    return (
      <div style={this.state.center}>
        <div style={this.state.body}>
          {children}
        </div>
      </div>
    );
  }
}

export default Adapt;