class Debouncer {
    constructor(delay){
        this.callStack=0;
        this.delay=delay || 20;
    }
    debounce(logic){
        this.callStack+=1;
        setTimeout(()=>{
            this.callStack-=1;
            this.callStack==0 && logic()
        },this.delay);
    }
}
export default Debouncer;