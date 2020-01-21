import * as io from 'socket.io-client';
import { newDefaultScheduler } from '@most/scheduler';
import { mousemove } from '@most/dom-event';
import { map, startWith, runEffects, tap } from '@most/core';

const arduinoPins = {
    backLeft: 3,
    backRight: 5,
    bellyLeft: 6,
    bellyRight: 9,
    chestLeft: 10,
    chestRight: 11,
    all: 0,
    left: 1,
    right: 2,
};

function dist(pt1, pt2) {
    
    let dx = Math.abs(pt1.x - pt2.x);
    let dy = Math.abs(pt1.y - pt2.y); 
    let r = Math.sqrt(dx * dx + dy * dy);

    if(r == 0) {
        return 250
    }

    return (r > Math.min(window.innerHeight/6, window.innerWidth/4)) ? 0 : Math.abs(r - 250) ;
}

let timerSent = 0;

class HapticFeedback {
    server: any;
    event: (_: any, v: any) => void;
    error: (a: any, b: any) => void;
    end: (a: any) => void;

    constructor(server) {
        this.server = io(server);
        this.setSink();
    }

    private send(pin, vibration) {
        this.server.emit("msg", `P${pin}V${Math.trunc(vibration)}E`);
    }

    l(vibration) { this.send(arduinoPins.left, vibration); }
    left(vibration) { this.l(vibration); }

    r(vibration) { this.send(arduinoPins.right, vibration); }
    right(vibration) { this.r(vibration); }

    a(vibration) { this.send(arduinoPins.all, vibration); }
    all(vibration) { this.a(vibration); }

    bal(vibration) { this.send(arduinoPins.backLeft, vibration); }
    bar(vibration) { this.send(arduinoPins.backRight, vibration); }

    bel(vibration) { this.send(arduinoPins.bellyLeft, vibration); }
    ber(vibration) { this.send(arduinoPins.bellyRight, vibration); }

    cl(vibration) { this.send(arduinoPins.chestLeft, vibration); }
    cr(vibration) { this.send(arduinoPins.chestRight, vibration); }

    setSink(){
        this.event = (_, v) => {
            if(timerSent < 20) {
                timerSent += 1;
                return;
            }
            timerSent = 0;
            let pbal = { x: window.innerWidth / 4, y: 5 * window.innerHeight / 6 }
            let pbar = { x: 3 * window.innerWidth / 4, y: 5 * window.innerHeight / 6 }
            let pbel = { x: window.innerWidth / 4, y: 3 * window.innerHeight / 6 }
            let pber = { x: 3 * window.innerWidth / 4, y: 3 * window.innerHeight / 6 }
            let pcl = { x: window.innerWidth / 4, y: window.innerHeight / 6 }
            let pcr = { x: 3 * window.innerWidth / 4, y: window.innerHeight / 6 }
            
            let pt = {x: v.x, y: v.y};
            
            this.bal(dist(pt, pbal));
            this.bar(dist(pt, pbar));

            this.bel(dist(pt, pbel));
            this.ber(dist(pt, pber));

            this.cl(dist(pt, pcl));
            console.log(dist(pt, pcl));
            this.cr(dist(pt, pcr));
        }
        this.error = (a, b) => console.log("ERROR: ", a, b);
        this.end = (a) => console.log("END: ", a)
    }
}

function hfb(serialport = 'http://localhost:3000') {
    return new HapticFeedback(serialport);
}

let sink = hfb();
let scheduler = newDefaultScheduler();
/*
let count = -1;
let s = most.constant(1, most.periodic(1000));
let source = most.map((x) => {
    count += 1;
    if (count % 2 === 0) {
        return 250
    } else {
        return 100
    }
}, s);
source.run(sink, scheduler);*/

const toCoords = e => { return {x: e.clientX, y: e.clientY}; }
map(toCoords, mousemove(document)).run(sink, scheduler);