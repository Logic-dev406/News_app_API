const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const walletSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    ledger_balance: {
        type: SchemaTypes.Double,
        default: 0.0,
        require: true,
    },
    available_balance: {
        type: SchemaTypes.Double,
        default: 0.0,
        require: true,
    },
    total_balance: {
        type: SchemaTypes.Double,
        default: 0.0,
        require: true,
    },
});

const wallet = mongoose.model('Wallet', walletSchema);

module.exports = wallet;
