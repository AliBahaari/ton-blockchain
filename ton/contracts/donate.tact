import "@stdlib/deploy";
import "@stdlib/ownable";
message DonateMessage {
    fullName: String;
}
struct DonorStruct {
    fullName: String;
    amount: Int as coins;
}
const FEE: Int = ton("0.1");

contract Donate with Ownable, Deployable {
    owner: Address;
    donors: map<Address, DonorStruct>;
    init(){
        self.owner = sender();
    }

    receive(msg: DonateMessage){
        let ctx: Context = context();
        require(ctx.value > ton("0.1"), "Donate amount should be greater than 0.1");
        self.donors.set(ctx.sender, DonorStruct{fullName: msg.fullName, amount: ctx.value});
    }

    receive("withdraw"){
        self.requireOwner();
        send(SendParameters{to: sender(), value: myBalance() - FEE, mode: SendRemainingValue | SendIgnoreErrors});
    }

    get fun returnDonors(): map<Address, DonorStruct> {
        return self.donors;
    }
}