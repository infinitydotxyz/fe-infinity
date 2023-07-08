# Frontend

Tools:

- nvm, node v16.
- recommend: vscode and extensions like eslint, prettier, editor config, git lense.

## Scripts

- `npm install`: Install or update dependencies, @infinityxyz/lib types.
- `npm run build`: Build this project, output to `build`.
- `npm start`: Start (launch) the built project: url: http://localhost:8080
- `npm run dev`: Start dev mode: http://localhost:3000

## Using the Debugger

- The debugger can be connected in one of two modes `launch` or `attach`

  - Use `attach` if you actively use chrome as your main browser
  - Only use `launch` if you mainly use a different browser and only use chrome for development. Otherwise the `userDataDir` setting - which allows you to launch the browser with your metamask - will prevent the browser from being launched correctly

- `attach`
  - Start the server `npm run dev`
  - Start chrome and pass the remote debugging port flag
    - On mac: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222`
  - Navigate to localhost:3000 in the window that opens
  - Open the Command Palette (⇧⌘P), select Debug: Select and Start Debugging, select `dev-attach`
- `launch`
  - Start the server `npm run dev`
  - Make sure chrome is closed
  - Open the Command Palette (⇧⌘P), select Debug: Select and Start Debugging, select `dev-launch`
