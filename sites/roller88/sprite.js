class Sprite {
    constructor(spriteWidth,spriteHeight,sprite) {
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.image = sprite;
        this.width = sprite.width;
        this.height = sprite.height;
    }
    draw(ctx, frame, width, height, x, y) {
        ctx.drawImage(this.sprite, (this.spriteWidth * frame) % this.width, this.spriteHeight * Math.floor((this.spriteWidth * frame) / this.width), this.spriteWidth, this.spriteHeight, x, y, width, height)
    }
}
