import Vue from 'vue'

var logged_user = null;

function mockasync(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({ data: data }), 600)
    })
}

const api = {
    login(username, password) {
        if (password) {
            logged_user = {
                username: username,
                first_name: 'Mark',
                last_name: 'Zuckerberg',
                email: 'zuck@facebook.com',
                notifications_enabled: true,
                permissions: {
                    ADMIN: username == 'admin',
                    STAFF: username == 'admin',
                }
            };
        }
        return mockasync(logged_user);
    },
    logout() {
        logged_user = null;
        return mockasync({});
    },
    whoami() {
        return mockasync(logged_user ? {
            authenticated: true,
            user: logged_user,
        } : { authenticated: false });
    },
    list_products() {
        return mockasync({
            pizzas: [
                {
                    id: 1,
                    photo: 'https://portal-amb-imgs.clubedaana.com.br/2019/01/pizza-de-frango-com-catupiry-18845.jpg',
                    name: 'Pizza de Frango com Catupiry',
                    description: `Frango e Catupiry`,
                    price: 20.50
                },
                {
                    id: 2,
                    photo: 'https://img.itdg.com.br/tdg/images/recipes/000/002/807/96170/96170_original.jpg?mode=crop&width=710&height=400',
                    name: 'Pizza Portuguesa',
                    description: `Presunto, ovo, ervilha, queijo e cebola.`,
                    price: 30.20
                },
            ],
            edges: [
                {
                    id: 1,
                    recheio: 'chocolate',
                    price: 2.00
                },
                {
                    id: 2,
                    recheio: 'catupity',
                    price: 1.50
                }
            ]
        });
    },
    get_config() {
        return mockasync({
            site_name: 'Hello Pizza',
            frete: 5.00,
            borda_price: 2.00,
            year: 2021,
            phone: '5512981346322',
            maintenance_mode: false
        })
    }
};

export default api;
