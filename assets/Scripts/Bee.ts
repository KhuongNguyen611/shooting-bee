import {
    _decorator,
    Canvas,
    Component,
    director,
    instantiate,
    Node,
    Prefab,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bee')
export class Bee extends Component {
    @property(Prefab)
    public explosionPrefab: Prefab;

    canvas: Canvas;

    isContact: boolean = false;

    protected start(): void {
        const scene = director.getScene();
        this.canvas = scene.getComponentInChildren(Canvas);
    }

    Init() {
        this.node.active = true;
        this.isContact = false;
    }

    protected update(dt: number): void {
        if (this.isContact) {
            this.node.active = false;
        }
    }

    HitContact() {
        this.isContact = true;
        let explosion: Node = instantiate(this.explosionPrefab);
        explosion.setParent(this.canvas.node, false);
        explosion.setWorldPosition(this.node.getWorldPosition());
    }
}
