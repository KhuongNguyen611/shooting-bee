import { _decorator, Component, Label, Node, NodeActivator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IngameUI')
export class IngameUI extends Component {
    @property(Label)
    public scoreText: Label;

    public score: number = 0;

    public static instance: IngameUI;

    protected onLoad(): void {
        IngameUI.instance = this;
        this.node.active = false;
    }

    Init() {
        this.score = 0;
        this.scoreText.string = 'Score: ' + this.score;
    }

    public UpdateScore(points: number) {
        this.score += points;
        this.scoreText.string = 'Score: ' + this.score;
    }
}
