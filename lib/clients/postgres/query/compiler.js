var push = Array.prototype.push;

// Extend the base compiler with the necessary grammar
module.exports = function(client) {

  var _        = require('lodash');
  var QueryCompiler = require('../../../query/compiler')(client);

  return QueryCompiler.extend({

    // Compiles a truncate query.
    truncate: function() {
      return 'truncate ' + this.tableName + ' restart identity';
    },

    // Compiles an `insert` query, allowing for multiple
    // inserts using a single query statement.
    insert: function() {
      var insertData = this.get('insert');
      var sql = 'insert into ' + this.tableName + ' ';
      if (insertData.columns === '()') {
        sql += 'default values';
      } else {
        sql += insertData.columns + ' values ' + insertData.value;
      }
      var returning = this.get('returning');
      push.apply(this.bindings, _.flatten(insertData.bindings));
      return sql + (returning.value ? ' ' + returning.value : '');
    },

    // TODO: Update all the response thingers here.

    // Compiles an `update` query, allowing for a return value.
    update: function() {
      var updateData = this.get('update');
      var returning = this.get('returning');
      var returnVal = (returning.value ? ' ' + returning.value : '');
      push.apply(this.bindings, updateData.bindings);
      return 'update ' + this.tableName + ' set ' + updateData.columns + ' ' + this.where() + returnVal;
    }

  });

};