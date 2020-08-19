# Wayne County IIS Analytics Script

## Setup:
1. Install [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/). The default options for both will sufice.
2. Open *Git Bash*, and navigate to the folder you would like the program's folder to be inside of with `cd`.
3. Run `git clone https://github.com/bscholer/wayne_county_iis_analtics.git`.
4. Open *Powershell*, navigate inside of the folder which was just downloaded, using `cd`.
5. Run `npm install`, which will install the required packages for the project.
    1. If npm is not found, follow [these instructions](https://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8-and-10#:~:text=Search%20for%20Environment%20Variables%20in,nodejs%5Cnode_modules%5Cnpm%5Cbin) to add the NodeJS folder to your computer's PATH variable.
    2. Close *Powershell*, and go back to step 4.
6. Open a *File Explorer* window, and navigate to the downloaded directory, and open the `index.js` file in your favorite text editor.
7. Edit the line starting with `const LOG_FILE_PATH`, and change the filepath there to match the folder containing the IIS log files.
8. Add one extra `\` to each existing one in the path. For example, if the path originally had `\\`, it should be changed to `\\\\`.

## Running the program:
1. Open *Powershell*, and navigate to the directory you downloaded.
2. Run `node .\index.js`, which will run the program.

## To update:
1. Open *Git Bash*.
2. Navigate inside of the downloaded directory, using `cd`.
3. Run `git stash`, which locally saves and temporarily hides local changes to the code.
4. Run `git pull`, which pulls down changes to the code.
5. Run `git stash pop`, which will reapply the previous changes to the code, and merge them back into the current codebase (locally).
