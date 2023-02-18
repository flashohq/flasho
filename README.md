<p align="center"><a  href="https://flasho.io/"><img  src="https://d35pnp6c7e171b.cloudfront.net/assets/flasho_banner.png"  height="100"/></a></p>

<h1 align="center">🚀 Open Source Customer Notifications for developers⚡️</h1>
<div align="center">The fastest tool to set up customer notifications. Set it up in minutes with little to no code. </div>

<p align="center">
<a href='https://discord.com/invite/3b4hzsyC4X'><img alt="Join Flasho Discord" src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white"/></a>
<a href='https://twitter.com/flasho_official'><img alt="Follow Flasho" src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white"/></a>
<a href='https://hub.docker.com/r/flashohq/flasho'><img alt="Docker Flasho" src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"></a>

<h4 align="center">
  <a href="https://discord.com/invite/3b4hzsyC4X">Discord</a> |
  <a href="https://docs.flasho.io/">Docs</a> |
  <a href="https://flasho.io">Website</a> |
  <a href="mailto:hello@flasho.io">Email</a> |
  <a href="https://www.ycombinator.com/launches/I2O-flasho-open-source-customer-notifications-for-developers/">YC Launch</a>
</h4>

</p>

<p align="center"><a  href="https://flasho.io/"><img  src="https://d35pnp6c7e171b.cloudfront.net/assets/demo_compressed.gif"  height="auto" width="100%"/></a></p>

## Why Flasho? 🧐

Managing product notifications in your codebase can get messy. Not only do you have to write microservices and integrate with a bunch of different service providers but also make multiple changes across different parts of your code every time you want to set up new notifications or make changes to existing ones. In comes Flasho- a single place to manage all your customer communication across channels.

Just connect your database, set up event triggers, create content and connect to the service provider of your choice through our DIY dashboard. Since it is self hosted, your customer data never leaves your servers. We believe that developers should spend their time on building their core product. That's why we are building Flasho, to make the process of setting up and managing customer notifications an absolute breeze!

## Features 🌈

1. Triggers based on Database Events
1. Dynamic Variables based on your Database
1. Conditions to setup sophisticates business logic
1. WYSIWYG Email and SMS Editor with an extensive library of templates
1. Integration with Top SMS and Email Services

- SES
- Pinpoint Email
- Pinpoint SMS
- Sendgrid
- SNS
- Twilio
  <br />
  <br/>

# Quick Start 🎬

To create your free self-hosted Flasho environment use our [docker image](https://hub.docker.com/r/flashohq/flasho).
Docker deployment is available for the following cloud environments.

- [AWS](https://docs.flasho.io/docs/deployment-guides/aws)
- [Azure](https://docs.flasho.io/docs/deployment-guides/azure)
- [GCP](https://docs.flasho.io/docs/deployment-guides/google-cloud-platform)
- [Digital Ocean](https://docs.flasho.io/docs/deployment-guides/digital-ocean)

## Using Flasho locally using Docker ⚡️

1. Clone the repository

```jsx
  git clone --depth 1 https://github.com/flashohq/flasho.git
```

2. Run the docker by using docker-compose command

```jsx
 docker-compose up -d
```

3. You can now visit [http://localhost:8080](http://localhost:8080) to start using Flasho

<b><div align="center"><font size="5">OR</font></div></b>

1. Pull the docker image from the docker hub [flashohq/flasho](https://hub.docker.com/r/flashohq/flasho).

```jsx
docker pull flashohq/flasho:latest
```

2. You can run the docker container using this command

```jsx
docker run -p 8080:8080 flashohq/flasho
```

3. You can now visit [http://localhost:8080](http://localhost:8080) to start using Flasho
   <br/>

# Status ✅

We are currently in Public Aplha. Version v0.0.1
<br/>
<br/>

# License 📜

Most of Flasho’s code is under the MIT licence, as included in the Flasho repository on GitHub. Code of paid features if any, however, is covered by a proprietary licence.

Any third party components incorporated into our code are licensed under the original licence provided by the owner of the applicable component.

# Need Help ? ℹ️

We are always there to help you. If you are facing any issues or problems while working on this project , join our [discord server](https://discord.gg/DZ5PKmj6vc)
and ask for help. Connect with other developers on the [Discord community](https://discord.gg/3b4hzsyC4X) and discuss anything related to the project.

# Links 🔗

- [Homepage](https://flasho.io)
- [Contribution Guidelines](https://github.com/flashohq/flasho/blob/master/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/flashohq/flasho/blob/master/CODE_OF_CONDUCT.md)
