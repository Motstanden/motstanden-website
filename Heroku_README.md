How to deploy using Heroku CLI for Windows:

### Ordered list

1. Start up Heroku CLI by running cmd and then logging in with 'heroku login'.
2. This step should only be necessary to do once. If you haven't already; clone the GitHub repository by using the following four commands in sequence. 'heroku git:clone -a motstanden-web', 'cd motstanden-web', 'git remote add origin https://github.com/MotstandenWeb/motstanden-web', and finally 'git pull origin master'. 
3. If already cloned; navigate to the repo folder with 'cd motstanden-web', then pull from repo with 'git pull origin master'
4. Run the command 'heroku create'.
5. Navigate into the client folder using 'cd client' command.
6. Install the node-modules with 'npm install' command.
7. Build React using the command 'npm run build'.
8. Make sure all the above steps have been done in order of appearance, then push the repo with the command 'git push heroku master'
9. Check if the upload was a success by typing 'heroku open' and your browser should open the heroku app.
