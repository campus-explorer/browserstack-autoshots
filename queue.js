var emitter = require('events').EventEmitter,
	util = require ('util');

function createQueue (initialSize){
	this.size = initialSize || 2;
	this.queue = [];
	this.events = Object.create (emitter.prototype);
	queueManager = this;

	emitter.call(this.events);

	this.done = function (){
		setTimeout( function (){
			queueManager.events.emit('next');
		}, 3000);
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

	this.events.addListener ('next', this.release);

	return {
		getSize: function (){
			return this.size;
		},

		add: function (fn){
			if (queue.length < size){
				if (fn){
					addToQueue (fn);
				}else{
					addToQueue (function(){return true;})
				}
			} else {
				if (fn){
					addToQueue (fn);
				} else {
					return false;
				}
			}
		},
		run: function (){
			for (var counter=0; counter<size; counter++){
				release();
			}
		},
		on: events.on,
		once: events.once
	}

}

module.exports = createQueue();