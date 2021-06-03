import Debouncer from './debouncer.js';

class Subscriber {
    constructor(topics){
        this.topic=topics || {};
        this.subscriptions={};
    }
    subscribe(path,callback){
        let subpath = path.join("-");
        let uniqId = this.uuidv4();
        var subscription = {
            id:uniqId,
            callback:callback,
            unsubscribe:()=>{
                this.unsubscribe(subpath,uniqId);
            },
            publish:(data)=>{
                this.publish(path,data);
            },
            get:()=>{
                return this.pluck(this.topic,path)
            }
        }
        if(subpath in this.subscriptions){
            this.subscriptions[subpath].push(subscription);
        }
        else{
            this.subscriptions[subpath]=[subscription];
            this.subscriptions[subpath].debouncer = new Debouncer();
        }
        return subscription;
    }
    unsubscribe(subpath,uniqId){
        let removeAt=this.subscriptions[subpath].findIndex((subscription)=>{
            return subscription.id === uniqId;
        });
        if(this.subscriptions[subpath].length == 1 ){
            removeAt >=0 ? delete this.subscriptions[subpath] : 0 ; 
        }
        else{
            removeAt >=0 ? this.subscriptions[subpath].splice(removeAt,1) : 0 ;
        }  
    }
    get(path){
        return this.pluck(this.topic,path);
    }
    publish(path,data){
        Object.assign(this.pluck(this.topic,path),data);
        this.subscriptions[path.join("-")].debouncer.debounce(()=>{
            this.subscriptions[path.join("-")].forEach((subscription)=>{
                subscription.callback(this.pluck(this.topic,path),subscription);
            });
        })
    }
    pluck(data,path,set=null){
        if(path.length>1){
        return this.pluck( data[path[0]] , path.slice(1,path.length) , set );
      }
      else{
          if(path.length==0){
            return data;
          }
          else{
              if(set==null){
                return data[path[0]];
              }
              else{
                data[path[0]]=set;
                return data[path[0]];
              }
          }
      }
    }
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
export default Subscriber