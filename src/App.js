import React, { Component } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
  apiKey: "29b697069c6046569131d2c56b70eb72",
});

const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 300,
        line_linked: {
          shadow: {
            enable: {
              enable: true,
              color: "3CA9D1",
              blur: 10,
            },
          },
        },
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFAce =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("input_image");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    return {
      leftCol: clarifaiFAce.left_col * width,
      topRow: clarifaiFAce.top_row * height,
      rightCol: width - clarifaiFAce.right_col * width,
      bottomRow: height - clarifaiFAce.left_col * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        console.log(response);
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  // https://www.byrdie.com/thmb/j922lTh-Vn8HnmQsxSKGA0ztxw0=/756x756/filters:no_upscale():max_bytes(150000):strip_icc()/Rob-cc2d68e18be04acf90a74623c1087fd6.jpg

  // https://d5nunyagcicgy.cloudfront.net/external_assets/hero_examples/hair_beach_v391182663/original.jpeg

  render() {
    const { isSignedIn, route, imageUrl, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />

        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
        ) : this.state.route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
