const cmd = require('node-cmd');
const args = process.argv;
const fs = require('fs');
/** FLAGS
 * --env
 */
const flags = [{
    flagSymbol: ['-env', '-e'],
    flagName: 'environment',
    flagValue: ''
}];

args.forEach((arg, argIndex) => {
    // if args match flagSymbol, assign the next indexElement to flagValue
    flags.forEach(flag => {
        if(flag.flagSymbol.indexOf(arg) >= 0){
            flag.flagValue = args[argIndex+1];
        }
    })
});

const environmentValue = flags.filter(flag => flag.flagName === 'environment')[0].flagValue;

new Promise((resolve, reject) => {
    fs.readdir('./config', (err, files) => {
        if(err) return reject(err);
        if(!files) return reject('no files found, is /config directory exists');
        const foundFileName = files.filter(file => {
            return file.indexOf(environmentValue) >= 0
        })[0];
        resolve(foundFileName);
    })
})
.then(foundFileName => {
    // 1. set the heroku-app-name
    // 2. assign each variable to heroku:config
    return new Promise((outerResolve, reject) => {
        fs.readFile('./config/'+foundFileName, 'utf8', (err, data) => {
            if(err) return reject(err);

            let herokuAppName;
            const arrayData = data.split('\n');
            new Promise(resolve => {
                if(arrayData[0].indexOf('heroku-app-name=') === 0){
                    const line = arrayData[0];
                    herokuAppName = line.replace('heroku-app-name=', '');
                    cmdAsync(`git remote rm heroku`).catch(err => {console.log('NO remote heroku')});
                    cmdAsync(`heroku git:remote -a ${herokuAppName}`)
                    // cmdAsync(`git remote set-url heroku https://git.heroku.com/${herokuAppName}.git`)
                     .then(result => {
                         setTimeout(() => resolve(), 1000)
                     })
                } else {
                    throw new Error('must define heroku-app-name at first line');
                }
            })
            .then(result => {
                const configSet = arrayData.map(line => {
                    line = line.split('#')[0];
                    if(!line || line.length === 0 || line[0] === '#'  || line.indexOf('=') < 0) return Promise.resolve();
                    line = line.replace('\n', '');
                    return cmdAsync(`heroku config:set ${line}`)
                });
                Promise.all(configSet)
                .then(outerResolve)
                .catch(err => {throw new Error(err)})

            })
            
            
        })
    })
})
.then(result => {
    console.log('RESULT', result);
    console.log('Deploying to heroku');
    // push this file to heroku
    cmdAsync(`git push staging master`).then(res => console.log(res))
})
.catch(messageError => {
    console.log(messageError);
    throw new Error(messageError);
})

// open config dir and find .env_[environmentValue] or .env-[environmentValue]
// if not found throw error, file not found
// if found open the file


    // get heroku app name
    // set heroku app name
    // heroku git:remote -a [heroku-app-name]

    // and loop for each line and set the environment
    // remove '\n'
    // heroku config:set [eachline]

    //




// helper
const cmdAsync = (commandLineString) => {
    return new Promise((resolve, reject) => {
        cmd.get(
            commandLineString,
            function(err, data, stderr){
                if(data && commandLineString.indexOf('git push') === 0 || commandLineString.indexOf('heroku git:remote -a') === 0){
                    console.log(data);
                }
                if(err && commandLineString.indexOf('rm heroku') > 0){
                    return resolve();
                }
                if(err) {
                    console.error(err);
                    console.log('failed at: ' + commandLineString)
                    throw new Error(err);
                }
                if(err) return reject(err);
                if(stderr) return resolve(stderr);
                if(data) return resolve(data);
            }
        );
    })
};


const forEachAsync = (array, func, index=0) => {
    let lastIndex = array.length-1;
    if(index > lastIndex) return;

    function next(nextIndex){
        return function(){
            return forEachAsync(array, func, nextIndex);
        }
    }
    const currentElement = array[index];
    const currentIndex = index;
    const nextIndex = index + 1;
    return func(currentElement, currentIndex, next(nextIndex))
}