class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.userId = cart.userId;
        this.products = cart.products.map(item => ({
            productId: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity
        }));
        this.total = this.calculateTotal();
    }

    calculateTotal() {
        return this.products.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

export default CartDTO;

