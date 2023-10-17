import {
    _decorator,
    Canvas,
    CCInteger,
    Component,
    director,
    Node,
    UITransform,
    Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Starfield')
export class Starfield extends Component {
    @property(Node)
    public starfield1: Node;

    @property(Node)
    public starfield2: Node;

    public startfieldHeight1: number;
    public startfieldHeight2: number;

    public tempStartLocation1 = new Vec3();
    public tempStartLocation2 = new Vec3();

    @property(CCInteger)
    public moveSpeed: number;

    private canvasHeight: number;

    protected onLoad(): void {
        this.startUp();
    }

    startUp() {
        this.startfieldHeight1 =
            this.starfield1.getComponent(UITransform).height;
        this.startfieldHeight2 =
            this.starfield2.getComponent(UITransform).height;

        this.tempStartLocation1.y = 0;
        this.tempStartLocation2.y = this.startfieldHeight1;

        this.starfield1.setPosition(this.tempStartLocation1);
        this.starfield2.setPosition(this.tempStartLocation2);

        const scene = director.getScene();
        const canvas = scene.getComponentInChildren(Canvas);
        this.canvasHeight = canvas.getComponent(UITransform).height;
    }

    update(deltaTime: number) {
        this.tempStartLocation1 = this.starfield1.position;
        this.tempStartLocation2 = this.starfield2.position;

        this.tempStartLocation1.y -= this.moveSpeed * deltaTime;
        this.tempStartLocation2.y -= this.moveSpeed * deltaTime;

        if (this.tempStartLocation1.y <= 0 - this.startfieldHeight1) {
            this.tempStartLocation1.y = this.canvasHeight;
        }

        if (this.tempStartLocation2.y <= 0 - this.startfieldHeight2) {
            this.tempStartLocation2.y = this.canvasHeight;
        }

        this.starfield1.setPosition(this.tempStartLocation1);
        this.starfield2.setPosition(this.tempStartLocation2);
    }
}
