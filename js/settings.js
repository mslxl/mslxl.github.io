
class Settings {
    constructor(name){
        let content = localStorage.getItem(name)
        this.name = name
        if (content!==null){
            this.data = JSON.parse(content)
        } else {
            this.data = {}
        }
    }
    putValue(key,value){
        this.data[key] = value
        this.save()
    }

    getValue(key,def){
        let value = this.data[key]
        if (typeof value === "undefined" || value ===null||value === undefined){
            this.data[key] = def
        }
        return this.data[key]
    }

    save(){
        localStorage.setItem(this.name,JSON.stringify(this.data))
    }
}

if (typeof window.global === 'undefined'){
    window.global = {}
}
global.settings = new Settings('global')
