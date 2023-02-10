# Flasho

<a href="https://flasho.io/"><img src="https://flasho-stage.chutneystore.com/logo/logo.svg" align="right" ></a>
Flasho is an open source platform for developers to set up customer notifications in less than 5 minutes.



Read more at [flasho.io](https://flasho.io) and the [docs](https://docs.flasho.io).

---
<br/>

## Why Flasho?

We want to transform the way products communicate with their users - make communication faster, smarter and more effective. Our goal is to help developers set up a highly personalised, sophisticated user communication system in minutes! A system that increases customer delight by sending the right messages, to the right people at the right time!

## Features

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

# Quick Start

To create your free self-hosted Flasho environment use our docker image. Docker deployment is available for the following cloud environments.

- [AWS](https://docs.flasho.io/docs/deployment-guides/aws)
- [Azure](https://docs.flasho.io/docs/deployment-guides/azure)
- [GCP](https://docs.flasho.io/docs/deployment-guides/google-cloud-platform)
- [Digital Ocean](https://docs.flasho.io/docs/deployment-guides/digital-ocean)

## Using Flasho locally using Docker

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
docker run -p 8080:8080 vishnau97/flasho-test
```

3. You can now visit [http://localhost:8080](http://localhost:8080) to start using Flasho
<br/>

# Status

We are currently in Public Aplha. Version v0.0.1
<br/>
<br/>

# License

Most of Flasho’s code is under the MIT licence, as included in the Flasho repository on GitHub. Code of paid features if any, however, is covered by a proprietary licence.

Any third party components incorporated into our code are licensed under the original licence provided by the owner of the applicable component.

# Need Help ?

We are always there to help you. If you are facing any issues or problems while working on this project , join our [discord server]( https://discord.gg/DZ5PKmj6vc)
and ask for help. Connect with other developers on the [Discord community](https://discord.gg/3b4hzsyC4X) and discuss anything related to the project.
# Links 
- [Homepage](https://flasho.io)
- [Contribution Guidelines](https://github.com/flashohq/flasho/blob/master/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/flashohq/flasho/blob/master/CODE_OF_CONDUCT.md)
