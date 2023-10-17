import {
    _decorator,
    CCInteger,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    Vec3,
} from 'cc';
import { Bee } from './Bee';
import { IngameUI } from './IngameUI';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property({
        type: CCInteger,
    })
    public moveSpeed: number = 300;
    public isContact: boolean = false;

    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.group === Math.pow(2, 3)) {
            this.isContact = true;
            otherCollider.getComponent(Bee).HitContact();
            IngameUI.instance.UpdateScore(20);
        }
    }

    onEndContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.group === Math.pow(2, 2)) {
            this.isContact = true;
        }
    }

    update(deltaTime: number) {
        this.node.translate(
            Vec3.UP.clone().multiplyScalar(this.moveSpeed * deltaTime)
        );
        if (this.isContact) {
            this.node.destroy();
        }
    }
}
