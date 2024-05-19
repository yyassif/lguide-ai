# LGuide-AI - Your Best Assistant, Empowered by Generative AI

LGuide-AI is a chatbot designed to help users find nearby service providers such as hotels, restaurants, supermarkets, and more. Whether you're a traveler looking for accommodation or a local resident searching for the best dining options, LGuide-AI is the right service to assist you.

<!-- <div align="center">
  <img src="./logo.png" width="100%" alt="LGuide-AI-logo" style="padding-bottom: 20px"/>
</div> -->

## Key Features 🎯
Comprehensive Listings: Find nearby hotels, restaurants, supermarkets, and other service providers.
User-Friendly Interface: 
Location-Based Search: Get results based on your current location.
Detailed Information: Access detailed information about each service provider, including contact details, reviews, and ratings.

- **Comprehensive Listings**: Find nearby hotels, restaurants, supermarkets, and other service providers.
- **User-Friendly Interface**: Easy-to-use chatbot interface for seamless interaction.
- **Location-Based Search**: Get result listings based on your current location.
- **Detailed Information**: Access detailed information about each service provider, including contact details, reviews, and ratings.

## Demo Highlights 🎥

![Demo](demo.mp4)

## Getting Started 🚀

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

You can find a live demo here: [LGuide-AI](https://lguideai.yyassif.dev).

### Prerequisites 📋

Ensure you have the following installed:

- Docker
- Docker Compose

### 60 seconds Installation 💽
  We will easily be able to deploy our product thanks to `Docker`.

- **Step 1**: Clone the repository:

  ```bash
  git clone https://github.com/yyassif/thinkai-lquide.git && cd thinkai-lquide
  ```

- **Step 2**: Copy the `.env.example` files

  ```bash
  cp .env.example .env
  ```

- **Step 3**: Update the `.env` files

  ```bash
  nano .env # or emacs or vscode or vim
  ```

  Update **OPENAI_API_KEY** in the `.env` file.

  You just need to update the `OPENAI_API_KEY` variable in the `.env` file. You can get your API key [here](https://platform.openai.com/api-keys). You need to create an account first. And put your credit card information. Don't worry, you won't be charged unless you use the API. You can find more information about the pricing [here](https://openai.com/pricing/).

- **Step 4**: Launch the project

  All you'll need is to invoke the `docker compose`

  ```bash
  docker compose pull
  docker compose up -d
  ```

  If you have a Mac, go to Docker Desktop > Settings > General and check that the "file sharing implementation" is set to `VirtioFS`.

  If you are a developer, you can run the project in development mode with the following command: `docker compose -f docker-compose.dev.yml up --build`

- **Step 5**: Login to the app

  You can now sign in to the app with `admin@admin.com` & `admin`. You can access the app at [http://localhost:3000/login](http://localhost:3000/login).

  You can access LGuide-AI backend API at [http://localhost:5050/docs](http://localhost:5050/docs)

### Detailed Instruction to start the dev locally

As you known FastAPI is a great tool for local development before being production ready.

- **Step 0**: Install python-pyenv && python-pipenv:

  Run the following command based on your os-convenience:

  ```bash
  sudo pacman -S python-pipenv python-pyenv # Arch users
  pip install pipenv pyenv # Windows users
  brew install pipenv pyenv # Mac users
  ```

- **Step 1**: Install python3.11 & create a virtual environment using pipenv accordingly:

  Install Python 3.11:

  ```bash
  pyenv install 3.11
  ```

  Create a Python 3.11 virtual environment:

  ```bash
  pipenv shell
  ```

  Install dependencies (all packages) from `Pipfile` or `Pipfile.lock` if it exists:

  ```bash
  pipenv install
  ```

- **Step 1**: Launch the development server locally:

  Now all the dependencies are installed and ready to use, change directory to backend folder:

  ```bash
  cd backend
  ```

  Let's launch the development server from FastAPI:

  ```bash
  uvicorn main:app --reload --host 0.0.0.0 --port 5050 --workers 6 --log-level info
  ```

  The server and endpoints are gonna be accessible at the following URL: [http://localhost:5050](http://localhost:5050).
  The server documentation is accessible at the following URL: [http://localhost:5050/docs](http://localhost:5050/docs).

 - **Step 2**: Launch the development frontend locally:
  Now let's move on to the fronted side

  ```bash
  cd frontend && npm run install
  ```

  Let's launch the development frontend:

  ```bash
  npm run dev
  ```

  The frontend is gonna be accessible at the following URL: [http://localhost:3000](http://localhost:3000).

## Updating LGuide-AI 🚀

- **Step 1**: Pull the latest changes without ruining your files:

  **Please DON'T USE `git pull`**

  For pulling and syncing latest changes here's the practical way:

  ```bash
  git fetch && git merge
  ```

- **Step 2**: Update the migration

  ```bash
  docker compose up -d
  ```

## License 📄

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details
