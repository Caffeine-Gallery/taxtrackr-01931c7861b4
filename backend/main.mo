import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";

actor {
    // Define the TaxPayer type
    public type TaxPayer = {
        tid: Text;
        firstName: Text;
        lastName: Text;
        address: Text;
    };

    // Create stable storage for upgrades
    private stable var taxpayersEntries : [(Text, TaxPayer)] = [];
    
    // Initialize HashMap with stable data
    private var taxpayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

    // System functions for upgrade
    system func preupgrade() {
        taxpayersEntries := Iter.toArray(taxpayers.entries());
    };

    system func postupgrade() {
        taxpayers := HashMap.fromIter<Text, TaxPayer>(taxpayersEntries.vals(), 0, Text.equal, Text.hash);
        taxpayersEntries := [];
    };

    // Add a new taxpayer record
    public func addTaxPayer(tp: TaxPayer) : async Bool {
        // Check if TID already exists
        switch (taxpayers.get(tp.tid)) {
            case (null) {
                taxpayers.put(tp.tid, tp);
                true
            };
            case (?existing) {
                false
            };
        }
    };

    // Get all taxpayer records
    public query func getAllTaxPayers() : async [TaxPayer] {
        Iter.toArray(taxpayers.vals())
    };

    // Search for a taxpayer by TID
    public query func searchByTID(tid: Text) : async ?TaxPayer {
        taxpayers.get(tid)
    };
}
