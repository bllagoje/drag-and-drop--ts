// Autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value
    let adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            let boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

// --------------------------------------------------
// ProjectInput class
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    // --------------------------------------------------
    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLElement
        
        let importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = "user-input"
        // ----------------------------
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement
        // ----------------------------
        // Configure
        this.configure()
        // Attach
        this.attach()
    }
    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        console.log(this.titleInputElement.value)
        
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element)
    }
}


const prjInput = new ProjectInput()