Infra TS

VERSION:1.1.1

RELEASED FEATURES:

1. Crypt service has been added.
2. Implemented Static file feature.

Fixed issues:

1. Update on Santizing array
2. Update feature on Role and Role permission

Introduction
This project is built using NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

Prerequisites
Ensure you have the following installed on your machine:

- Node.js: Version 20.11.0 or higher is required. You can download Node.js from https://nodejs.org/.
- npm: npm is automatically installed with Node.js. To check your npm version, run `npm -v`.

Installation

1. Install Nest CLI
   Nest CLI is a command-line interface tool that helps in creating and managing NestJS projects.

Run the following command:
npm install -g @nestjs/cli

2. Clone the Repository
   Clone this repository to your local machine.

Run the following commands:
git clone <repository_url>
cd <repository_name>

3. Install Dependencies
   Install the necessary dependencies for the project.

Run the following command:
npm install

Configuration

1. Node.js Version Requirement
   Ensure that your Node.js version is 20.11.0 or higher. You can check your Node.js version using the following command:

Run the following command:
node -v

2. Create Configuration File from sample config given below
   Create a configuration file inside the `config` folder. This file will store the application's configuration settings.

Steps:

- Navigate to the `config` folder (create it if it doesn't exist).

Run the following command:
mkdir config

- Create a `config.json` file inside the `config` folder with the following sample content:

```
{
  "development": {
    "type": "",
    "host": "",
    "port": ,
    "username": "",
    "password": "d",
    "database": "",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "synchronize": true,
    "logging": true
  },
  "production": {
    "type": "",
    "host": "",
    "port": ,
    "username": "",
    "password": "",
    "database": "",
    "entities": ["dist/**//*.entity{.ts,.js}"],
    "synchronize": false,
    "logging": false
  },
  "local": {
    "type": "",
    "host": "",
    "port": ,
    "username": "",
    "password": "",
    "database": "",
    "entities": "["src/**/*.entity{.ts,.js}"]",
    "synchronize": true,
    "logging": true
  }
}
```

Replace the placeholders (`your_username`, `your_password`, etc.) with your actual configuration details.

Running the Application

Development
To start the application in development mode, use the following command:

npm run start:dev

Now go to your browser and hit the localhost:<PORT>/api
