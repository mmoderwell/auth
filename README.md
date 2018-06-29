# auth

This repository is the Node.js backend to the project. You can find the machine learning Python backend in [this repository](https://github.com/mmoderwell/auth_backend).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need node, npm, and mongo installed globally on your machine.

```
sudo apt-get install node.js npm mongodb
```

### Installing

A step by step series of examples that tell you how to get a development env running

Clone this repository to your machine. You will need node, npm, and mongo installed globally on your machine.
```
git clone https://github.com/mmoderwell/auth.git
```

Navigate to auth folder then run

```
npm install
```

Create a .env file and add the following line

```
ENVIRONMENT=DEVELOPMENT
```

To start the server

```
node auth.js
```

After completing all the steps above, you can see the app in action in your browser

```
localhost:8008/
```

## Built With

* [auth_backend](https://github.com/mmoderwell/auth_backend) - The facial recognition backend


## Authors

* **Matt Moderwell** - *Initial work* - [mmoderwell.com](https://mmoderwell.com)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
## Acknowledgments

* **David Sandberg** - *FaceNet - Facial recognition* - [github.com/davidsandberg/](https://github.com/davidsandberg/)

