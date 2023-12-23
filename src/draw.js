export function line(ctx, x, y, x2, y2, color) {
    ctx.save();

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

export function rect(ctx, x, y, x2, y2, color, fill) {
    ctx.save();

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x, y2);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }

    ctx.restore();
}