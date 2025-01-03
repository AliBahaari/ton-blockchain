import "@stdlib/deploy";
message TransferMessage {
    amount: Int as uint64;
}
message HowMuchMessage {
    campaignAddress: Address;
    address: Address;
    amount: Int as uint64;
}

contract HelpToken {
    campaignAddress: Address;
    address: Address;
    amount: Int as uint64;
    init(initCampaignAddress: Address, initAddress: Address){
        self.campaignAddress = initCampaignAddress;
        self.address = initAddress;
        self.amount = 0;
    }

    receive(msg: TransferMessage){
        self.amount = msg.amount;
    }

    receive("HowMuch"){
        send(SendParameters{
                to: self.campaignAddress,
                value: 0,
                body: HowMuchMessage{
                    campaignAddress: self.campaignAddress,
                    address: self.address,
                    amount: self.amount
                }.toCell()
            }
        );
    }
}

contract Charity with Deployable {
    goal: Int as uint64;
    deadline: Int as uint64;
    init(initGoal: Int, initDeadline: Int){
        self.goal = initGoal;
        self.deadline = initDeadline;
    }

    receive("Donate"){
        let ctx: Context = context();
        let helpToken: StateInit = initOf HelpToken(myAddress(), ctx.sender);
        send(SendParameters{
                to: contractAddress(helpToken),
                value: 0,
                body: TransferMessage{amount: ctx.value}.toCell(),
                data: helpToken.data,
                code: helpToken.code
            }
        );
    }

    receive(msg: HowMuchMessage){
        self.returnAll(msg);
    }

    get fun returnAll(msg: HowMuchMessage): HowMuchMessage {
        return msg;
    }
}