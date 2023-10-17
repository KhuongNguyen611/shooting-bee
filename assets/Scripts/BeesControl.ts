import {
    _decorator,
    CCInteger,
    Component,
    instantiate,
    Node,
    Prefab,
    randomRangeInt,
    tween,
    Vec3,
} from 'cc';
import { Bee } from './Bee';
import { StageManager } from './StageManager';
const { ccclass, property } = _decorator;

@ccclass('BeesControl')
export class BeesControl extends Component {
    @property(CCInteger)
    public moveSpeed: number;

    @property(CCInteger)
    public distance: number;

    public direction: number = 1;

    @property(Prefab)
    public enemyBulletPrefab: Prefab;

    spawnBulletTimer: number = 0;

    @property(Node)
    public enemyBulletParent: Node;

    isReady: boolean = false;
    beesList: Bee[];

    protected onLoad(): void {
        this.beesList = this.getComponentsInChildren(Bee);
    }

    Init(): void {
        this.beesList.forEach((bee) => {
            bee.Init();
        });
        this.isReady = false;
        this.enemyBulletParent.destroyAllChildren();
    }

    Ready() {
        this.isReady = true;
    }

    update(deltaTime: number) {
        if (!this.isReady) return;
        this.node.translate(
            Vec3.RIGHT.clone().multiplyScalar(
                this.moveSpeed * deltaTime * this.direction
            )
        );
        if (
            this.node.position.x >= this.distance * this.direction &&
            this.direction === 1
        ) {
            this.direction = -1;
        } else if (
            this.node.position.x <= this.distance * this.direction &&
            this.direction === -1
        ) {
            this.direction = 1;
        }

        this.BeesSpawnBullet(deltaTime);
    }

    BeesSpawnBullet(deltaTime: number) {
        let activeBeesList = this.beesList.filter((bee) => bee.node.active);

        if (activeBeesList.length <= 0) {
            StageManager.Instance.EndStage(true);
            return;
        }

        this.spawnBulletTimer -= deltaTime;
        if (this.spawnBulletTimer <= 0) {
            let enemyBullet = instantiate(this.enemyBulletPrefab);
            enemyBullet.setParent(this.enemyBulletParent, false);
            enemyBullet.setWorldPosition(
                activeBeesList[
                    randomRangeInt(0, activeBeesList.length)
                ].node.getWorldPosition()
            );
            this.spawnBulletTimer = 1;
        }
    }
}
