# Contribute to Flasho 
    
We value every contribution to Flasho - big or small. Here is everything you need to know about contributing to our product. 

## Reporting bugs or adding issues

If you want to report bugs or add issues, add them [here](https://github.com/flashohq/flasho/issues/new). Before raising a new issue, please search within existing ones [here](https://github.com/flashohq/flasho/issues) to make sure you're not creating a duplicate. 

When you report a bug, make sure you give as much detail as possible. Clearly describe the current behaviour with screenshots, the expected behaviour and mention the step by step instructions to re-create the bug.

## Deciding what to work on

We maintain a list of good first issues that are a great way for you to get started with contributing to Flasho. You can also pick up any other issues, though they may be more complicated to work with. 

## Questions on issues 

If you have any questions or doubts related to any issue, just drop a comment under it so the author can clarify.   

## New Feature request 

If you have feature requests / ideas for new features , you can put them [here](https://github.com/flashohq/flasho/issues). 

## Help, Feedback, Suggestions 

We are always looking forward to hearing from you. For any help, questions, feedback or suggestions, feel free to open a Github discussion or join our Discord [server](https://discord.com/invite/3b4hzsyC4X). 

## Ways to Contribute 

- Set up the Flasho dashboard and give us your feedback/ suggestions.
- Report bugs
- Help with open issues [here](https://github.com/flashohq/flasho/issues) or add your issues [here](https://github.com/flashohq/flasho/issues/new)
- Add new providers 
- Request new features along with an implementation plan 
- Create blogs/ tutorials
- Help improve our documentation 


## Licensing

Most of Flasho’s code is under the MIT licence, as included in the Flasho repository on GitHub. Code of paid features if any, however, is covered by a proprietary licence.

Any third party components incorporated into our code are licensed under the original licence provided by the owner of the applicable component.


## Add new service providers 

If you want us to add a provider, we don't have yet, you can just request by creating an issue [here](https://github.com/flashohq/flasho/issues)

## Projects setup and Architecture

### Requirements
- Python version v3.9.12
- Node.JS version v18.0.0
- Postgres([Setup](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database))
- [yarn](https://yarnpkg.com) 
- [pip](https://packaging.python.org/en/latest/tutorials/installing-packages/) - (if you want to add packages to the backend)

### Setup the project
The project is a monorepo, meaning that it is a collection of multiple packages managed in the same repository.

-  Start with [forking](https://docs.github.com/en/get-started/quickstart/fork-a-repo) Flasho's [repository](https://github.com/flashohq/flasho). Clone or download your fork to your local machine.
After cloning your fork,

#### 1. Backend Server

- Install all the python dependencies
  
```jsx
pip install -r requirements.txt
```

- Run the backend server

```jsx
uvicorn --reload app.api:app
```

#### 2. Frontend
- This will install all the npm libraries
```jsx
cd web-app && yarn
```

- You can run the development environment
  
```jsx
yarn dev
```

You can access the apps in 
1. Frontend @ [http://localhost:3000](http://localhost:8080)
2. Backend @ [http://localhost:8000/api/](https://localhost:8080/api/)


## Coding guidelines

To ensure consistency throughout the source code, please keep these rules in mind as you are working:
1. All features or bug fixes must be tested by one or more specs (unit-tests).
2. We use [Eslint Rule Guide](https://eslint.org/docs/latest/rules/), with minor changes. An automated formatter is available using prettier.
3. We use [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/) for the python formatting.

