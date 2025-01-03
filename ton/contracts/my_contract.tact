import "@stdlib/deploy";
import "@stdlib/ownable";
message DonateMessage {
    fullName: String;
}
struct DonaterStruct {
    fullName: String;
    amount: Int as coins;
}
const FEE: Int = ton("0.1");

contract MyContract with Ownable, Deployable {
    owner: Address;
    donaters: map<Address, DonaterStruct>;
    init(){
        self.owner = sender();
    }

    receive(msg: DonateMessage){
        let ctx: Context = context();
        require(ctx.value > ton("0.1"), "Donate amount should be greater than 0.1");
        self.donaters.set(ctx.sender, DonaterStruct{fullName: msg.fullName, amount: ctx.value});
    }

    receive("withdraw"){
        self.requireOwner();
        send(SendParameters{to: sender(), value: myBalance() - FEE, mode: SendIgnoreErrors});
    }
}