const Generator = require("yeoman-generator"),
    path = require("path"),
    glob = require("glob");

module.exports = class extends Generator {

    prompting() {
        return this.prompt([{
            type: "input",
            name: "projectname",
            message: "Name this project?",
            validate: (s) => {
                if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
                    return true;
                }
                return "Please use alpha numeric characters.";
            },
            default: "SampleOVP"
        }, {
            type: "input",
            name: "namespace",
            message: "Namespace do you want to use?",
            validate: (s) => {
                if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                    return true;
                }
                return "Please use alpha numeric characters.";
            },
            default: "com.my.org"
        },
        {
            type: "input",
            name: "cdsname",
            message: "CDS View Name?",
            validate: (s) => {
                if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                    return true;
                }
                return "Please use alpha numeric characters.";
            },
            default: ""
        },
        {
            type: "input",
            name: "description",
            message: "Description do you want to use?",
            default: "My OVP Page"
        },
        {
            type: "confirm",
            name: "newdir",
            message: "Would you like to create a new directory for the project?",
            default: true
        }]).then((answers) => {
            if (answers.newdir) {
                this.destinationRoot(`${answers.namespace}.${answers.projectname}`);
            }
            this.config.set(answers);
        });
    }

    writing() {
        const sViewName = this.config.get("viewname");
        const sViewType = this.config.get("viewtype");

        this.config.set("namespaceURI", this.config.get("namespace").split(".").join("/"));

        this.sourceRoot(path.join(__dirname, "templates"));
        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file);

            this.fs.copyTpl(sOrigin, sTarget, this.config.getAll());
        });
 
    }

    install() {
        this.installDependencies({
            bower: false,
            npm: true
        });
    }

    end() {
        this.spawnCommandSync("git", ["init", "--quiet"], {
            cwd: this.destinationPath()
        });
        this.spawnCommandSync("git", ["add", "."], {
            cwd: this.destinationPath()
        });
        this.spawnCommandSync("git", ["commit", "--quiet", "--allow-empty", "-m", "Initialize repository with easy-ui5"], {
            cwd: this.destinationPath()
        });
    }
};