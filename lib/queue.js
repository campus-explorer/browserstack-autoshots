var emitter = require('events').EventEmitter,
	util = require ('util');

function createQueue (initialSize){
	var queueManager = this;
	this.size = initialSize || 2;
	this.queue = [];
	this.events = Object.create (emitter.prototype);

	emitter.call(this.events);

	this.done = function (){
		setTimeout( function (){
			queueManager.events.emit('next');
		}, 2000);
	}

	this.release = function (){
		var fnToRun = queueManager.queue.pop();
		if (fnToRun){
			fnToRun(queueManager.done);
		}else{
			queueManager.events.emit('done');
		}
	}

	this.addToQueue = function (fn){
		this.queue.push (fn);
	}

	this.run = function (){
		for (var counter=0; counter<this.queue.length; counter++){
			release();
		}
	}

	this.events.addListener ('next', this.release);

	return {
		getSize: function (){
			return this.size;
		},

		add: function (fn){
//			if (queue.length < size){
				if (fn){
					addToQueue (fn);
				}else{
					addToQueue (function(){return true;})
				}
/*			} else {
				if (fn){
					addToQueue (fn);
				} else {
					return false;
				}
			}
*/
		},
		run: function (){
			run();
		},
		on: events.on,
		once: events.once
	}

}

module.exports = createQueue();