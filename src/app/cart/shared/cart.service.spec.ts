import { TestBed, inject } from '@angular/core/testing';

import { CartService } from './cart.service';
import { MessageService } from '../../messages/message.service';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';

describe('CartService Setup', () => {
    let cartService: CartService;
    let messageService: jasmine.SpyObj<MessageService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('MessageService', [
            'add',
            'addError'
        ]);

        TestBed.configureTestingModule({
            providers: [
                CartService,
                { provide: MessageService, useValue: spy }
            ]
        });

        cartService = TestBed.get(CartService);
        messageService = TestBed.get(MessageService);
    });

    it('should be created', () => {
        expect(cartService).toBeTruthy();
    });

    it('init cartItems array', () => {
        expect(cartService.getItems()).toEqual([]);
    });
});

describe('CartService Methods', () => {
    let cartService: CartService;
    let messageService: jasmine.SpyObj<MessageService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('MessageService', [
            'add',
            'addError'
        ]);

        TestBed.configureTestingModule({
            providers: [
                CartService,
                { provide: MessageService, useValue: spy }
            ]
        });

        cartService = TestBed.get(CartService);
        messageService = TestBed.get(MessageService);
    });

    it('addItem() 3 of the same products at once', () => {
        const testProduct = new Product(
            666,
            new Date().toISOString().split('T')[0],
            'Foo Product',
            'Lorem Ipsum...',
            89,
            99,
            10,
        );

        spyOn(cartService.itemsChanged, 'emit');

        // Add a cart item
        cartService.addItem(new CartItem(testProduct, 3));

        // Check items in cart
        expect(cartService.getItems()).toEqual([
            new CartItem(testProduct, 3)
        ]);

        expect(cartService.itemsChanged.emit).toHaveBeenCalled();
        expect(messageService.add).toHaveBeenCalled();
    });

    it('twice addItem() of the same product, amount should increase', () => {
        const testProduct = new Product(
            666,
            new Date().toISOString().split('T')[0],
            'Foo Product',
            'Lorem Ipsum...',
            89,
            99,
            10,
        );

        spyOn(cartService.itemsChanged, 'emit');

        // Add a cart item
        cartService.addItem(new CartItem(testProduct, 1));

        // Check items in cart
        expect(cartService.getItems()).toEqual([
            new CartItem(testProduct, 1)
        ]);

        expect(cartService.itemsChanged.emit).toHaveBeenCalled();
        expect(messageService.add).toHaveBeenCalled();

        // Add another of the same cart item
        cartService.addItem(new CartItem(testProduct, 1));

        // Check items in cart
        expect(cartService.getItems()).toEqual([
            new CartItem(testProduct, 2)
        ]);

        expect(cartService.itemsChanged.emit).toHaveBeenCalledTimes(2);
        expect(messageService.add).toHaveBeenCalledTimes(2);
    });

    it('addItems() 3 products in array at once', () => {
        const testProduct = new Product(
            666,
            new Date().toISOString().split('T')[0],
            'Foo Product',
            'Lorem Ipsum...',
            89,
            99,
            10,
        );

        const testArray = [
            new CartItem(testProduct, 1),
            new CartItem(testProduct, 2),
            new CartItem(testProduct, 3),
        ];

        spyOn(cartService, 'addItem').and.callThrough();

        // Add a cart item
        cartService.addItems(testArray);

        // Check items in cart
        expect(cartService.addItem).toHaveBeenCalledTimes(3);
        expect(messageService.add).toHaveBeenCalledTimes(3);
        expect(cartService.getItems()).toEqual([new CartItem(testProduct, 6)]);
    });

});
