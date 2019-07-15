const path = require('path');
const fs = require('fs');
const glob = require('glob');
const inquirer = require('inquirer');
const rollup = require('rollup');
const rimraf = require('rimraf');
const zlib = require('zlib');
const chalk = require('chalk');
const execa = require('execa');
const uglify = require('rollup-plugin-uglify').uglify;
const typescript = require('rollup-plugin-typescript2');
const ora = require('ora')

const spinner = ora({
    prefixText: `${chalk.green('\n[building tasks]')}`
})
const NO_ANWSER = Symbol('no answer');

const resolve = dir => path.resolve(__dirname, '../', dir);

const PascalCase = str => {
    const re = /-(\w)/g;
    const newStr = str.replace(re, (_, group1) => {
        return group1.toUpperCase();
    });
    return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

const generateBuildPluginsConfigs = (miniEnable, packageName) => {
    const tsConfig = {
        verbosity: -1,
        tsconfig: `./packages/${packageName}/tsconfig.json`
    };
    const plugins = [];

    if (miniEnable) {
        plugins.push(uglify());
    }
    plugins.push(typescript(tsConfig));

    return plugins;
};

const gePackagestName = () => {
    let packagesName = glob.sync('packages/*');
    packagesName = packagesName.filter(name => {
        const isPrivatePackage = require(resolve(`${name}/package.json`)).private;
        return !isPrivatePackage;
    }).map(name => name.split('packages/')[1]);

    return packagesName;
};

const getAnswersFromInquirer = async (packagesName) => {
    const question = {
        type: 'checkbox',
        name: 'packages',
        scroll: false,
        message: 'Select build repo(Support Multiple selection)',
        choices: packagesName.map(name => ({
            value: name,
            name
        }))
    };

    let { packages } = await inquirer.prompt(question);
    const noSeleted = packages.length === 0;

    if (noSeleted) {
        console.log(
            chalk.yellow(`
            It seems that you did't make a choice.
            
            Please try it again.
            `)
        );
        return NO_ANWSER;
    }

    if (packages.some(package => package === 'all')) {
        packages = gePackagestName();
    }

    const { yes } = await inquirer.prompt([{
        name: 'yes',
        message: `Confirm build ${packages.join(' and ')} packages?`,
        type: 'list',
        choices: ['Y', 'N']
    }]);

    if (yes === 'N') {
        console.log(chalk.yellow('[release] cancelled.'))
        return NO_ANWSER;
    }
    
    return packages;
};

const clearPackagesOldDist = (packagesName = []) => {
    for (let name of packagesName) {
        const distPath = resolve(`packages/${name}/dist`);
        const typePath = resolve(`packages/${name}/types`);
        if (fs.existsSync(distPath)) {
            rimraf.sync(distPath);
        }
        if (fs.existsSync(typePath)) {
            rimraf.sync(typePath);
        }

        fs.mkdirSync(distPath);
        fs.mkdirSync(typePath);
    }
};

const buildType = [
    {
        format: 'umd',
        ext: '.js'
    },
    {
        format: 'umd',
        ext: '.min.js'
    },
    {
        format: 'es',
        ext: '.esm.js'
    }
]

const generateBuildConfigs = (packagesName = []) => {
    const result = [];

    for(let name of packagesName) {
        for (let type of buildType) {
            let config = {
                input: resolve(`packages/${name}/src/index.ts`),
                output: {
                    file: resolve(`packages/${name}/dist/${name}${type.ext}`),
                    name: PascalCase(name),
                    format: type.format
                },
                plugins: generateBuildPluginsConfigs(type.ext.includes('min'), name)
            }

            Object.defineProperties(config, {
                'packageName': {
                    value: name
                },
                'ext': {
                    value: type.ext
                }
            });
            result.push(config);
        }
    }

    return result;
};

const getSize = code => {
    return (code.length / 1024).toFixed(2) + 'kb';
};

const copyDTSFiles = packageName => {
    console.log(chalk.cyan('> start copying .d.ts file to dist dir of packages own.'));
    const sourceDir = resolve(`packages/${packageName}/dist/packages/${packageName}/src/*`);
    const targetDir = resolve(`packages/${packageName}/dist/types/`);
    // execa.shellSync(`mv ${sourceDir} ${targetDir}`)
    console.log(chalk.cyan('> copy job is done.'));

    rimraf.sync(resolve(`packages/${packageName}/dist/packages`));
    rimraf.sync(resolve(`packages/${packageName}/dist/node_modules`));
};

const buildEntry = (config, curIndex, next) => {
    const miniEnable = /min.js$/.test(config.output.file);

    spinner.start(`${config.packageName}${config.ext} is buiding now. \n`);
    rollup.rollup(config).then(bundle => {
        bundle.write(config.output).then(({ output }) => {
            const code = output[0].code

            spinner.succeed(`${config.packageName}${config.ext} building has ended.`)

            function report(extra) {
                console.log(chalk.magenta(path.relative(process.cwd(), config.output.file)) + ' ' + getSize(code) + (extra || ''))
                next()
            }
            if (miniEnable) {
                zlib.gzip(code, (err, zipped) => {
                    if (err) return reject(err)
                    let words = `(gzipped: ${chalk.magenta(getSize(zipped))})`
                    report(words)
                })
            } else {
                report()
            }

            // since we need bundle code for three types
            // just generate .d.ts only once
            if (curIndex % 3 === 0) {
                copyDTSFiles(config.packageName);
            }
        });
    }).catch(e => {
        spinner.fail('buiding is failed')
        console.log(e);
    });
};

const build = (configs) => {
    let index = 0
    const total = configs.length
    const next = () => {
        buildEntry(configs[index], index + 1, () => {
            configs[index - 1] = null
            index++
            if (index < total) {
                next()
            }
        })
    }
    next()
};

const buildBootstrap = async () => {
    // 获取所有packages的名称
    const packagesName = gePackagestName();
    packagesName.unshift('all');

    const answers = await getAnswersFromInquirer(packagesName);

    if (answers === NO_ANWSER) return;

    clearPackagesOldDist(answers);

    const buildConfigs = generateBuildConfigs(answers)

    build(buildConfigs);
};

buildBootstrap().catch(err => {
    console.error(err);
    process.exit(1);
});
