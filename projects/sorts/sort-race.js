//*********************************************************
//               SORTS
//*********************************************************
function bubblesort(array) {
    var actions = [];

    function swap(i, j) {
        var t = array[i];
        array[i] = array[j];
        array[j] = t;
        actions.push({type: "swap", i: i, j: j});
    }

    var swapped = true;
    while (swapped) {
        swapped = false;
        // needs one "dummy" action per loop to make race 
        // fair with insertion sort
        actions.push({type: "hello"});  
        for (var i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i+1]) {
                swap(i, i+1);
                swapped = true;
            }
        }
    }

    return actions;
}

function insertionsort(array) {
    var actions = [];

    for (var i = 1; i < array.length; i++) {
        actions.push({type: "highlight", pivot: i});
        var key = array[i];
        var j = i - 1;
        while (array[j] > key) {
            actions.push({type: "swap", i: j, j: j+1});
            array[j+1] = array[j];
            j--;
        }
        array[j+1] = key;
    }

    return actions;
}

function mergesort(array) {
    var actions = [];

    function merge(p, q, r) {
        var n1 = q - p + 1,
            n2 = r - q;

        var L = new Array(n1 + 1),
            R = new Array(n2 + 2);

        for (var i = 0; i < n1; i++) {
            L[i] = array[p + i];
        }
        for (var j = 0; j < n2; j++) {
            R[j] = array[q + 1 + j];
        }

        // sentinel values per Cormen
        L[n1] = Number.POSITIVE_INFINITY;
        R[n2] = Number.POSITIVE_INFINITY;

        var i = 0,
            j = 0;

        // sentinel values allow skipping empty checks
        var orig = [];
        var permute = [];
        for (var k = p; k <= r; k++) {
            orig.push(k);
            if (L[i] <= R[j]) {
                array[k] = L[i];
                permute.push(p + i);
                i++;
            } else {
                array[k] = R[j];
                permute.push(q + 1 + j);
                j++;
            }
        }

        // need to push a dummy action for each other element 
        // of the array to make the race "fair"
        // by making a permute take O(n) actions
        for (var k = p; k < r; k++) {
            actions.push({type: "hello"});
        }
        actions.push({type: "permute", start: orig[0], 
                      end: orig[orig.length - 1], perm: permute});

    }

    function recurse(p, r) {
        if (p < r) {
            var q = ~~((p + r) / 2); 
            recurse(p, q);
            recurse(q+1, r);
            merge(p, q, r);
        }
    }

    recurse(0, array.length - 1);
    return actions;
}    

function heapsort(array) {
    var actions = [];

    function leftChild(i) {
        return 2*i + 1;
    }
    function rightChild(i) {
        return 2*i + 2;
    }

    function maxHeapify(i, heapSize) {
        var largest = i, L = leftChild(i), R = rightChild(i);

        largest = (array[L] > array[largest] ) ? L : largest;
        largest = (array[R] > array[largest] ) ? R : largest;

        if (largest <= heapSize && largest != i) {
            swap(largest, i);
            maxHeapify(largest, heapSize);
        }
    }

    function buildMaxHeap(heapSize) {
        for (var i = ~~(heapSize / 2); i >= 0; i--) {
            maxHeapify(i, heapSize);
        }
    }

    function swap(i, j) {
        var t = array[i];
        array[i] = array[j];
        array[j] = t;
        actions.push({type: "swap", i: i, j: j});
    }

    function heapsrt() {
        var heapSize = array.length - 1;
        buildMaxHeap(heapSize);

        for (var ii = array.length - 1; ii > 0; ii--) {
            swap(0, ii);
            heapSize--;
            actions.push({type: "highlight", pivot: 0});
            maxHeapify(0, heapSize);
        }        
    }

    heapsrt();
    return actions;
}

function quicksort(array) {
    var actions = [];

    function partition(left, right, pivot) {
        var v = array[pivot];
        swap(pivot, --right);
        for (var i = left; i < right; ++i) {
            if (array[i] <= v) {
                swap(i, left++);
            }
        }
        swap(left, right);
        return left;
    }

    function swap(i, j) {
        var t = array[i];
        array[i] = array[j];
        array[j] = t;
        actions.push({type: "swap", i: i, j: j});
    }

    function recurse(left, right) {
        while (left < right) {
            var pivot = left + ~~(Math.random() * (right - left));
            actions.push({type: "highlight", pivot: pivot});
            pivot = partition(left, right, pivot);
            recurse(left, pivot);
            left = pivot + 1;  // simulate tail-recursion
        }
    }

    recurse(0, array.length);
    return actions;
}

//*********************************************************
//               VARS
//*********************************************************

// get function name from the function object
function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}    
// sorts to compare
var functions = [insertionsort, heapsort, quicksort];   
var names = functions.map(functionName);  

// sort params
var duration = 30, n = 100,
    index = d3.range(n); 

// plot params
var masterWidth = Math.min(550, screen.width - 20);

var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = masterWidth - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var x = d3.scale.ordinal().domain(index)
        .rangePoints([0, width]),
    h = d3.scale.linear().domain([0, n - 1])
        .range([height/10, height]);

function transform(d, i) {
    return "translate(" + x(i) + "," + 
        (height - h(d)) + ")"; 
}

// define variables in loop, one set for each function    
var lap = new Array(functions.length);
var data = new Array(functions.length);
var svg = new Array(functions.length);
var line = new Array(functions.length);
var actions = new Array(functions.length);

for (var i = 0; i < functions.length; i++) {
    lap[i] = 0;
    data[i] = d3.shuffle(index.slice()),
    svg[i] = d3.select("#" + names[i]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + 
              "," + margin.top + ")");
    line[i] = svg[i].selectAll("line")
        .data(data[i])
      .enter().append("line")
        .attr("index", "i0")
        .attr("x2", 0)
        .attr("y2", 0);

    // sort each data set, post-binding
    actions[i] = functions[i](data[i]).reverse();
}


//*********************************************************
//               MAIN LOOP
//*********************************************************


function update() {
    var action;

    // update all the divs
    for (var i = 0; i < functions.length; i++) {
        action = actions[i].pop();

        if (action) {
            switch (action.type) {
                case "highlight": {
                    line[i].style("stroke", function(d, i) { 
                        return i == action.pivot ? "#dc322f" : null; 
                    });
                    break;
                }
                case "swap": {
                    var t = line[i][0][action.i];
                    line[i][0][action.i] = line[i][0][action.j];
                    line[i][0][action.j] = t;
                    break;
                }
                case "permute": {
                    var p = action.start, 
                        r = action.end;
                    var s = [];
                    // populate s with permuted elements of line
                    for (var k = 0; k <= r - p; k++) {
                        s.push(line[i][0][action.perm[k]]);
                    }
                    // now can just loop through s in order
                    for (var k = p; k <= r; k++) {
                        line[i][0][k] = s[(k - p)];
                    }
                    break;
                }    
            }

            line[i].attr("index", function(d, i) { return "i" + i; })
                .attr("y2", function(d) { return h(d); })
                .attr("transform", transform);
        }

    }

    // start over when a sort finishes
    for (var i = 0; i < functions.length; i++) {
        if (!actions[i].length) {
            // reset the sort and repeat
            d3.shuffle(data[i]);
            line[i].data(data[i]);

            actions[i] = functions[i](data[i]).reverse();

            lap[i]++;
            d3.select("#" + names[i] + "_lap").text(lap[i]);
        }
    }

}

setInterval(update, duration);