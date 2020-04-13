/**
 * @author Edouard DUPIN
 *
 * @copyright 2019, Edouard DUPIN, all right reserved
 *
 * @license MPL v2.0 (see license file)
 */

/**
 * @breif Generic interface to access to the BDD (no BDD, direct file IO)
 */
export class DataInterface {
	private name: string;
	private bdd: any;
	
	constructor(_name, _data) {
		this.name = _name;
		this.bdd = _data;
	}
	
	get_table_index(_id) {
		for (let iii=0; iii<this.bdd.length; iii++) {
			if (this.bdd[iii]['id'] == _id) {
				return iii;
			}
		}
		return undefined;
	}
	
	gets(_filter=undefined) {
		console.log("[I] gets " + this.name)
		if (_filter == undefined) {
			return this.bdd
		}
		return this.filter_object_values(this.bdd, _filter)
	}
	
	gets_where(_select, _filter=undefined, _orderBy=undefined){
		//console.log("[I] gets_where " + this.name + " select " + _select);
		let tmp_list = this.get_sub_list(this.bdd, _select);
		tmp_list = this.order_by(tmp_list, _orderBy);
		return this.filter_object_values(tmp_list, _filter);
	}
	
	get(_id){
		//console.log("[I] get " + this.name + " " + _id);
		for (let iii=0; iii<this.bdd.length; iii++) {
			if (this.bdd[iii]['id'] == _id) {
				return this.bdd[iii];
			}
		}
		console.log("[W] not found element{ " + this.bdd.length);
		return undefined;
	}
	
	set(_id, _value){
		console.log("[I] Set " + this.name + " " + _id)
		for (let iii=0; iii<this.bdd.length; iii++) {
		console.log("    check: " + " " + this.bdd[iii]['id'])
			if (this.bdd[iii]['id'] == _id) {
				console.log(" *** Set specific values: " + _id + "  " + JSON.stringify(_value, null, 2));
				this.bdd[iii] = _value
			}
		}
	}
	
	delete(_id) {
		console.log("[I] delete " + this.name + " " + _id)
		for (let iii=0; iii<this.bdd.length; iii++) {
			if (this.bdd[iii]['id'] == _id) {
				this.bdd.splice(iii, 1);
			}
		}
	}
	
	// TODO: rework this
	find(_listToken, _values) {
		let out = []
		for (let iii=0; iii<this.bdd.length; iii++) {
			let find = true
			for (let jjj=0; jjj<_listToken.length; jjj++) {
				if (this.bdd[iii][_listToken[jjj]] != _values[_listToken[jjj]]) {
					find = false;
					break;
				}
			}
			if (find == true) {
				out.push(this.bdd[iii]);
			}
		}
		return out;
	}
	
	count(_select = undefined) {
		if (_select == undefined) {
			return this.bdd.length;
		}
		let tmp = this.get_sub_list(this.bdd, _select);
		return tmp.length;
	}
	
	exit_in(_value: any, _listValues: any) {
		for (let iii=0; iii<_listValues.length; iii++) {
			if (_value == _listValues[iii]) {
				return true;
			}
		}
		return false;
	}
	
	get_sub_list(_values, _select) {
		let out = [];
		for (let iii_elem=0; iii_elem<_values.length; iii_elem++) {
			let find = true;
			if (_select.length == 0) {
				find = false;
			}
			//console.log("Check : " + JSON.stringify(_values[iii_elem], null, 2));
			for (let iii_select=0; iii_select < _select.length; iii_select++) {
				if (_select[iii_select].length != 3) {
					console.log("[E] Internal Server Error: wrong select definition ...");
					return undefined;
				}
				let type_check = _select[iii_select][0];
				let token = _select[iii_select][1];
				let value = _select[iii_select][2];
				if (value instanceof Array) {
					if (_values[iii_elem][token] !== undefined) {
						if (type_check == "==") {
							if (this.exit_in(_values[iii_elem][token], value) == false) {
								find = false
								break
							}
						} else if (type_check == "!=") {
							if (this.exit_in(_values[iii_elem][token], value) == false) {
								find = false
								break;
							}
						} else {
							console.log("[ERROR] Internal Server Error{ unknow comparing type ...");
							return undefined;
						}
					} else {
						find = false;
						break;
					}
				} else {
					//console.log("    [" + token + "] = " + _values[iii_elem][token]);
					if (_values[iii_elem][token] !== undefined) {
						//console.log("        '" + type_check + "' " + value);
						if (type_check == "==") {
							if (_values[iii_elem][token] != value) {
								find = false;
								break;
							}
						} else if (type_check == "!=") {
							if (_values[iii_elem][token] == value) {
								find = false;
								break;
							}
						} else if (type_check == "<") {
							if (_values[iii_elem][token] >= value) {
								find = false;
								break;
							}
						} else if (type_check == "<=") {
							if (_values[iii_elem][token] > value) {
								find = false;
								break;
							}
						} else if (type_check == ">") {
							if (_values[iii_elem][token] <= value) {
								find = false;
								break;
							}
						} else if (type_check == ">=") {
							if (_values[iii_elem][token] < value) {
								find = false;
								break;
							}
						} else {
							console.log("[ERROR] Internal Server Error{ unknow comparing type ...");
							return undefined;
						}
					} else {
						find = false;
						break;
					}
				}
			}
			if (find == true) {
				//console.log("            ==> SELECTED");
				out.push(_values[iii_elem])
			} else {
				//console.log("            ==> NOT SELECTED");
			}
		}
		return out;
	}
	
	order_by(_values, _order) {
		if (_order == undefined) {
			return _values;
		}
		if (_order.length == 0) {
			return _values;
		}
		let value_order = _order[0]
		let out = []
		let out_unclassable = []
		for (let iii=0; iii<_values.length; iii++) {
			if (_values[iii][value_order] === undefined) {
				out_unclassable.push(_values[iii]);
				continue;
			}
			if (_values[iii][value_order] == null) {
				out_unclassable.push(_values[iii]);
				continue;
			}
			out.push(_values[iii]);
		}
		//console.log("order in list by : " + value_order);
		//out = sorted(out, key=lambda x{ x[value_order])
		out.sort(function (a, b) {
				//const name1 = t1.name.toLowerCase();
				//const name2 = t2.name.toLowerCase();
				if (a[value_order] > b[value_order]) { return 1; }
				if (a[value_order] < b[value_order]) { return -1; }
				return 0;
			});
		if (_order.length > 1) {
			out_unclassable = this.order_by(out_unclassable, _order.slice(1));
		}
		for (let jjj=0; jjj<out_unclassable.length; jjj++) {
			out.push(out_unclassable[jjj]);
		}
		return out;
	}
	
	filter_object_values(_values, _filter) {
		let out = []
		if (_filter == undefined) {
			return _values;
		}
		if (_filter.length == 1) {
			let token = _filter[0]
			for (let iii=0; iii<_values.length; iii++) {
				if (_values[iii][token] === undefined) {
					continue;
				}
				if (this.exit_in(_values[iii][token], out) == false) {
					out.push(_values[iii][token]);
				}
			}
			return out;
		}
		for (let iii=0; iii<_values.length; iii++) {
			let element_out = {}
			for (let jjj=0; jjj<_filter.length; jjj++) {
				if (_values[iii][_filter[jjj]] === undefined) {
					continue;
				}
				element_out[_filter[jjj]] = _values[iii][_filter[jjj]]
			}
			out.push(element_out)
		}
		return out;
	}

}

