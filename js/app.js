var epool = epool || {};

var teamsJson = '[{"code":"AM","name":"Atlético Madrid"},{"code":"BA","name":"Barcelona"},{"code":"BM","name":"Bayern Munich"},{"code":"DO","name":"Dortmund"},{"code":"JU","name":"Juventus"},{"code":"LC","name":"Leicester City"},{"code":"MO","name":"Monaco"},{"code":"RM","name":"Real Madrid"}]',
	policyJson = '[{"round":0,"point":{"w":2,"t":1,"l":0}},{"round":1,"point":{"w":2,"t":1,"l":0}},{"round":2,"point":{"w":2,"t":1,"l":0}}]';

var matchesJson = '[{"teamName":"BA","round":0,"result":"w","score":2,"rival":"JU"},{"teamName":"JU","round":0,"result":"l","score":1,"rival":"BA"}]';

var allEntriesJson = '[{"id":0,"name":"Ray Liang","t0":"BA","p0":0,"t1":"BM","p1":0,"t2":"AM","p2":0,"t3":"MO","p3":0,"t4":"DO","p4":0,"t5":"RM","p5":0,"t6":"LC","p6":0,"t7":"JU","p7":0,"t8":"1","p8":0,"pp":0}]';
	
epool.teams = {};
epool.policy = {};
epool.matches = {};
epool.entries = [];
epool.entry = {
	id: 0,
	name: "",
	t0: "",
	p0: 0,
	t1: "",
	p1: 0,
	t2: "",
	p2: 0,
	t3: "",
	p3: 0,
	t4: "",
	p4: 0,
	t5: "",
	p5: 0,
	t6: "",
	p6: 0,
	t7: "",
	p7: 0,
	t8: "",
	p8: 0,
	pp: 0
}
epool.currentId = 0;
epool.nextId = epool.entries.length;
epool.maxPoint = 0;
epool.MURank = "1";

epool.init = function () {
	epool.teams = JSON.parse(teamsJson);
	epool.policy = JSON.parse(policyJson);
	//epool.loadData('./data/matches.json');
    //epool.matches = JSON.parse(matchesJson);
};

epool.loadData = function($url) {
	$.ajax({
      url: $url,
      dataType: 'json',
      cache: true,
      async: true,      // avoid XMLHttpRequest request within the main thread
      success: function (data) {
          epool.matches = data;
      },
      error: function(xhr, status, err) {
        console.error($url, status, err.toString());
      }
	});
}

epool.calc = function(team, weight) {
	var point = 0;
	//console.log("TeamCode is %s and point is %d", team, weight);
	if (!epool.isTeamExist(team)) {
		console.error(team + " is not in Final 8 teams");
		return false;
	}
	
	for (var i = 0; i < epool.matches.length; i++) { 
		if (team === epool.matches[i].teamName) {
		    if (epool.matches[i].result === 'w') {
		        point += weight * 2;
		        if (epool.matches[i].round === 2 && weight === 8) point += 10;
		    }
		    else if (epool.matches[i].result === 't')
		        point += weight;
		}

	}
	
	return point;
}

epool.isTeamExist = function(team) {
	for (var i = 0; i < epool.teams.length; i++) { 
		if (team === epool.teams[i].code) {
			return true;
		}
	}
	return false;
}

epool.setLocalStorage = function(entries) {
	localStorage.setItem("entriesJson", JSON.stringify(entries));
}

epool.removeLocalStorage = function() {
	localStorage.removeItem("entriesJson");
}

epool.setEntryValue = function() {
	// team's name
	epool.entry.t0 = $('#sel-cat0').val();
	epool.entry.t1 = $('#sel-cat1').val();
	epool.entry.t2 = $('#sel-cat2').val();
	epool.entry.t3 = $('#sel-cat3').val();
	epool.entry.t4 = $('#sel-cat4').val();
	epool.entry.t5 = $('#sel-cat5').val();
	epool.entry.t6 = $('#sel-cat6').val();
	epool.entry.t7 = $('#sel-cat7').val();
	epool.entry.t8 = $('#sel-cat8').val();
	
	// the point relevant to team
	epool.entry.p0 = epool.calc(epool.entry.t0, 8);
	epool.entry.p1 = epool.calc(epool.entry.t1, 7);
	epool.entry.p2 = epool.calc(epool.entry.t2, 6);
	epool.entry.p3 = epool.calc(epool.entry.t3, 5);
	epool.entry.p4 = epool.calc(epool.entry.t4, 4);
	epool.entry.p5 = epool.calc(epool.entry.t5, 3);
	epool.entry.p6 = epool.calc(epool.entry.t6, 2);
	epool.entry.p7 = epool.calc(epool.entry.t7, 1);
	if (epool.entry.t8 === epool.MURank) epool.entry.p8 = 10;
	//epool.entry.p8 = epool.calc2(epool.entry.t8);
	epool.entry.pp = epool.entry.p0 + epool.entry.p1 + epool.entry.p2 + epool.entry.p3 + epool.entry.p4
                   + epool.entry.p5 + epool.entry.p6 + epool.entry.p7 + epool.entry.p8;
	    	
	$('#cat0Point').val(epool.entry.p0);
	$('#cat1Point').val(epool.entry.p1);
	$('#cat2Point').val(epool.entry.p2);
	$('#cat3Point').val(epool.entry.p3);
	$('#cat4Point').val(epool.entry.p4);
	$('#cat5Point').val(epool.entry.p5);
	$('#cat6Point').val(epool.entry.p6);
	$('#cat7Point').val(epool.entry.p7);
	$('#cat8Point').val(epool.entry.p8);
	$('#totalPoint').val(epool.entry.pp);
}

epool.updateCurrentEntryFromBuffer = function(i) {
	epool.entries[i].t0 = epool.entry.t0;
	epool.entries[i].t1 = epool.entry.t1;
	epool.entries[i].t2 = epool.entry.t2;
	epool.entries[i].t3 = epool.entry.t3;
	epool.entries[i].t4 = epool.entry.t4;
	epool.entries[i].t5 = epool.entry.t5;
	epool.entries[i].t6 = epool.entry.t6;
	epool.entries[i].t7 = epool.entry.t7;
	epool.entries[i].t8 = epool.entry.t8;
	
	epool.entries[i].p0 = epool.entry.p0;
	epool.entries[i].p1 = epool.entry.p1;
	epool.entries[i].p2 = epool.entry.p2;
	epool.entries[i].p3 = epool.entry.p3;
	epool.entries[i].p4 = epool.entry.p4;
	epool.entries[i].p5 = epool.entry.p5;
	epool.entries[i].p6 = epool.entry.p6;
	epool.entries[i].p7 = epool.entry.p7;
	epool.entries[i].p8 = epool.entry.p8;
	epool.entries[i].pp = epool.entry.pp;
}

epool.resetEntry = function() {
	epool.entry.id = 0;
	epool.entry.name = "";
	epool.entry.t0 = "";
	epool.entry.p0 = 0;
	epool.entry.t1 = "";
	epool.entry.p1 = 0;
	epool.entry.t2 = "";
	epool.entry.p2 = 0;
	epool.entry.t3 = "";
	epool.entry.p3 = 0;
	epool.entry.t4 = "";
	epool.entry.p4 = 0;
	epool.entry.t5 = "";
	epool.entry.p5 = 0;
	epool.entry.pp = 0;
}

epool.setSelectOptions = function(entry) {
	$('#sel-cat0').val(entry.t0);
	$('#sel-cat1').val(entry.t1);
	$('#sel-cat2').val(entry.t2);
	$('#sel-cat3').val(entry.t3);
	$('#sel-cat4').val(entry.t4);
	$('#sel-cat5').val(entry.t5);
	$('#sel-cat6').val(entry.t6);
	$('#sel-cat7').val(entry.t7);
	$('#sel-cat8').val(entry.t8);
}

epool.resetSelectOptions = function() {
	$('#sel-cat0').val('ZZ');
	$('#sel-cat1').val('ZZ');
	$('#sel-cat2').val('ZZ');
	$('#sel-cat3').val('ZZ');
	$('#sel-cat4').val('ZZ');
	$('#sel-cat5').val('ZZ');
	$('#sel-cat6').val('ZZ');
	$('#sel-cat7').val('ZZ');
	$('#sel-cat8').val('ZZ');
}

epool.isEntryExist = function(name) {
	for (var i = 0; i < epool.entries.length; i++) {
		if (name === epool.entries[i].name) return true;
	}
	return false;
}

epool.getMaxPoint = function() {
	for (var i = 0; i < epool.entries.length; i++) {
		if (epool.entries[i].pp > epool.maxPoint) 
			epool.maxPoint = epool.entries[i].pp;
	}
	$('#btnRank > span.badge').text(epool.maxPoint);

	return epool.maxPoint;
}

epool.updateAllEntriesValue = function() {
	for (var i = 0; i < epool.entries.length; i++) {
		epool.setSelectOptions(epool.entries[i]);
		epool.setEntryValue();
		epool.updateCurrentEntryFromBuffer(i);
	}
}

epool.quickSort = function (key, items, left, right) {
    var index;

    if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(key, items, left, right);

        if (left < index - 1) {
            epool.quickSort(key, items, left, index - 1);
        }

        if (index < right) {
            epool.quickSort(key, items, index, right);
        }
    }

    function swap(items, firstIndex, secondIndex) {
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    function partition(key, items, left, right) {
        var pivot = items[Math.floor((right + left) / 2)],
            i = left,
            j = right;

        while (i <= j) {
            while (items[i][key] < pivot[key]) {
                i++;
            }

            while (items[j][key] > pivot[key]) {
                j--;
            }

            if (i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }

        return i;
    }

    return items;
}

epool.renderEntrieSelection = function(entriesObj) {
	var s = $("#sel-entry");
	s.empty();
	for (var i = 0; i < entriesObj.length; i++) {	
		s.append($('<option>', {
            value: entriesObj[i].id,
            text:  (entriesObj[i].id + 1) + " -- " + entriesObj[i].name + "  (" + entriesObj[i].pp + ")"
        }));
	};
}

epool.updateIDinEntries = function() {
	for (var i = 0; i < epool.entries.length; i++) {	
		epool.entries[i].id = i;
	};
}

epool.rank = function() {
	// update all entries' value
	epool.updateAllEntriesValue();
	// sort 
	epool.quickSort("pp", epool.entries);
	// reverse as descending order
	epool.entries.reverse();
	// adjust the id according to rank
	epool.updateIDinEntries();
	// load entries to selection's options
	epool.renderEntrieSelection(epool.entries);
	// save entries object to local storage    		
	epool.setLocalStorage(epool.entries);
	
	// point to the first entry
	epool.setSelectOptions(epool.entries[0]);
	$("#sel-entry").trigger('change'); 
	epool.getMaxPoint();
}

epool.initElementsEvent = function () {
    $('#btnCalc').on('click', function () {
        epool.setEntryValue();
    });

    $('#btnReset').on('click', function () {
        epool.resetSelectOptions();
    });

    $('#btnRank').on('click', function () {
        epool.rank();
        //Materialize.toast('The function is in developing, it will be released in next version', 2500);
    });

    $('#btnSave').on('click', function () {
        var name = $('#inputEntryName').val().trim();
        if (name !== "" && epool.isEntryExist(name) !== true) {
            epool.entry.name = name;
            epool.entry.id = epool.nextId;
            epool.setEntryValue();		// set buffer entry's value
            var newEntry = $.extend(true, {}, epool.entry);
            epool.entries.push(newEntry);

            epool.nextId = epool.entries.length;
            epool.currentId = epool.nextId - 1;

            // update Local Storage
            epool.setLocalStorage(epool.entries);

            // update entry selection's option
            $("#sel-entry").append($('<option>', {
                value: epool.entries[epool.currentId].id,
                text: epool.entries[epool.currentId].name
            }));

            // point to new entry
            $("#sel-entry").val(epool.currentId);

            Materialize.toast('entry of "' + epool.entries[epool.currentId].name + '" Saved', 3000);
        }
        else {
            if (name === "")
                Materialize.toast('A name of the entry is required', 2500);
            else if (epool.isEntryExist(name) === true)
                Materialize.toast('An entry with same name is alreay exist', 2500);
        }
    });

    $('#btnDele').on('click', function () {
        if (epool.entries.length > 0) {
            var arrDeletedEntries = epool.entries.splice(epool.currentId, 1);

            if (epool.entries.length !== 0) {
                if (parseInt(epool.currentId) === epool.entries.length)
                    epool.currentId = epool.currentId - 1;	// if deleted the last one, offset -1
                else {
                    for (var i = epool.currentId; i < epool.entries.length; i++) {
                        epool.entries[i].id = i;
                    }
                }

                // refresh the entry selection's options
                var s = $("#sel-entry");
                s.empty();
                for (var i = 0; i < epool.entries.length; i++) {
                    s.append($('<option>', {
                        value: epool.entries[i].id,
                        text: epool.entries[i].name
                    }));
                }

                // point to current entry
                $('#sel-entry').val(epool.currentId);
                $('#sel-entry').trigger('change');
            }
            else {
                $("#sel-entry").empty();
                $("#sel-entry").val('');
                epool.nextId = 0;
                epool.removeLocalStorage();
            }

            Materialize.toast('entry of "' + arrDeletedEntries[0].name + '" Deleted', 3000);
        }
        else
            Materialize.toast('You don\'t save any entry yet', 2500);
    });
}

epool.initEntryLoading = function () {
    // load entries from json and push them in entry array
    var entriesObj = {};
    if (localStorage.getItem("entriesJson"))
        entriesObj = JSON.parse(localStorage.getItem("entriesJson"));
    else
        entriesObj = JSON.parse(allEntriesJson);

    for (var i = 0; i < entriesObj.length; i++) {
        epool.entries.push(entriesObj[i]);
    }
    epool.currentId = 0;
    epool.nextId = epool.entries.length;  // will be the new entry's id

    // update all entries' value
    epool.updateAllEntriesValue();
    // sort 
    epool.quickSort("pp", epool.entries);
    // reverse as descending order
    epool.entries.reverse();
    // adjust the id according to rank
    epool.updateIDinEntries();
    // load entries to selection's options
    epool.renderEntrieSelection(epool.entries);
    // save entries object to local storage    		
    epool.setLocalStorage(epool.entries);

    // add changeListener to selection element
    $("#sel-entry").on('change', function () {
        epool.currentId = $(this).val();
        epool.setSelectOptions(epool.entries[epool.currentId]);

        $('#cat0Point').val(epool.entries[epool.currentId].p0);
        $('#cat1Point').val(epool.entries[epool.currentId].p1);
        $('#cat2Point').val(epool.entries[epool.currentId].p2);
        $('#cat3Point').val(epool.entries[epool.currentId].p3);
        $('#cat4Point').val(epool.entries[epool.currentId].p4);
        $('#cat5Point').val(epool.entries[epool.currentId].p5);
        $('#cat6Point').val(epool.entries[epool.currentId].p6);
        $('#cat7Point').val(epool.entries[epool.currentId].p7);
        $('#cat8Point').val(epool.entries[epool.currentId].p8);
        $('#totalPoint').val(epool.entries[epool.currentId].pp);
    });

    // point to the first entry
    epool.setSelectOptions(epool.entries[0]);

    epool.getMaxPoint();

    return epool.maxPoint;
}

$(document).ready(function () {
    epool.init();
    
    epool.initElementsEvent();

    var promise = new Promise(function (resolve, reject) {
        resolve(1);
    });
    
    //promise.then(function (data) {
    //    console.log("promise 1 with data1 %d", data);
    //    return epool.init();
    //}).
    $.getJSON('./data/matches.json').success(function(data) {
        epool.matches = data;
        return epool.matches
    }).then(function (data) {
        console.log(data);
        return epool.initEntryLoading();
    }).then(function (data) {
        console.log("promise 3 with data %d", data);
        epool.rank();
    });;
});