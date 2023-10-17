import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EndgameUI')
export class EndgameUI extends Component {
    @property(Label)
    public endTitle: Label;

    public static instance: EndgameUI;

    protected onLoad(): void {
        EndgameUI.instance = this;
        this.node.active = false;
    }

    Init(isWin: boolean) {
        let endString = 'You';
        if (isWin) {
            this.endTitle.string = endString + ' Win';
        } else {
            this.endTitle.string = endString + ' Lose';
        }
    }
}
