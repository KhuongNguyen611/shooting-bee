import {
    _decorator,
    CCString,
    Component,
    director,
    Node,
    tween,
    Vec3,
} from 'cc';
import { Ship } from './Ship';
import { BeesControl } from './BeesControl';
import { IngameUI } from './IngameUI';
import { EndgameUI } from './EndgameUI';
const { ccclass, property } = _decorator;

@ccclass('StageManager')
export class StageManager extends Component {
    @property(Node)
    public stageTitle: Node;

    @property(Ship)
    public ship: Ship;

    @property(BeesControl)
    public beesControl: BeesControl;

    @property(CCString)
    public nextStageName: string;

    public static Instance: StageManager;

    protected onLoad(): void {
        StageManager.Instance = this;
    }

    protected start(): void {
        this.InitStage();
    }

    InitStage() {
        this.ship.Init();
        this.beesControl.Init();
        IngameUI.instance.Init();
        EndgameUI.instance.node.active = false;
        this.StartStage();
    }

    StartStage() {
        tween(this.ship.node)
            .set({ position: new Vec3(0, -380, 0) })
            .to(1, { position: new Vec3(0, -200, 0) })
            .start();

        tween(this.beesControl.node)
            .set({ position: new Vec3(0, 460, 0) })
            .to(1, { position: new Vec3(0, 130, 0) })
            .start();

        tween(this.stageTitle)
            .set({ scale: Vec3.ZERO, active: true })
            .to(1, { scale: Vec3.ONE })
            .delay(0.5)
            .call(() => {
                this.stageTitle.active = false;
                this.ship.Ready();
                this.beesControl.Ready();
                IngameUI.instance.node.active = true;
            })
            .start();
    }

    EndStage(isWin: boolean) {
        IngameUI.instance.node.active = false;
        EndgameUI.instance.node.active = true;
        EndgameUI.instance.Init(isWin);
    }

    NextStage() {
        director.loadScene(this.nextStageName);
    }
}
