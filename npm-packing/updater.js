const fse = require('fs-extra');
const exec = require('child_process').exec;
const c = require('chalk').default;

console.log(c.red('Limpando compilacoes antigas...'))
fse.ensureDir('./dist')
    .then(() => fse.ensureDir('./src'))
    .then(() => fse.emptyDir('./dist'))
    .then(() => {
        console.log(c.red('Limpando sources antigos...'))
        return fse.emptyDir('./src')
    })
    .then(() => {
        console.log(c.green('Copiando novos sources...'))
        return fse.copy('../dev/src/react-satisfying-forms', './src')
    })
    .then(() => {
        console.log(c.green('Compilando...'))
        return compilaSources()
    }).then(() => {
        console.log(c.green('Tudo pronto!'))
    }).catch((err) => {
        console.log(c.red('Prrr'))
        console.log(c.red(err))
    })


function compilaSources() {
    return new Promise((resolve, reject) => {
        exec('tsc', (error, stdout, stderr) => {
            if (error) 
                reject(stderr)
            resolve(stdout)
        })
    })
}