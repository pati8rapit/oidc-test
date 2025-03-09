from flask import Flask, request, jsonify
import datetime

app = Flask(__name__)
app.json.ensure_ascii = False

users = [
    {"id": 1, "name": "山田太郎", "age":18, "email": "yamada@example.com", "created_at": "2023-01-15T09:30:00"},
    {"id": 2, "name": "鈴木花子", "age":20, "email": "suzuki@example.com", "created_at": "2023-02-20T14:15:00"},
    {"id": 3, "name": "佐藤次郎", "age":30, "email": "sato@example.com", "created_at": "2023-03-10T11:45:00"}
]

products = [
    {"id": 1, "name": "ノートパソコン", "price": 120000, "stock": 50},
    {"id": 2, "name": "スマートフォン", "price": 85000, "stock": 100},
    {"id": 3, "name": "ワイヤレスイヤホン", "price": 25000, "stock": 200}
]

def find_by_id_from_users(users, id):
    try:
        return next(user for user in users if str(user["id"]) == id)
    except StopIteration:
        return None
    
def get_next_user_id(users):
    max_id = 0

    for user in users:
        if max_id < user['id']:
            max_id = user['id']
    
    return max_id + 1

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/users/", methods=['GET'])
def get_users():

    return jsonify({
        "users": users,
        "total": len(users)
    })

@app.route("/api/users/<user_id>", methods=['GET'])
def get_user(user_id):

    user = find_by_id_from_users(users, user_id)

    if user is None:
        return jsonify({
            "user": None,
        })

    return jsonify({
        "user": user,
    })

@app.route("/api/users", methods=['POST'])
def post_user():
    
    json = request.get_json()

    now = datetime.datetime.now()
    user = {
        "id": get_next_user_id(users),
        "name": json['name'],
        "age": json['age'],
        "email": json['email'],
        "created_at": now
    }

    users.append(user)

    return jsonify({
        "user": user
    })

@app.route("/api/users/<user_id>", methods=['PUT'])
def put_user(user_id):

    user = find_by_id_from_users(users, user_id)

    if user is None:
        return jsonify({
            "message": "存在しないユーザーです。"
        })
    
    json = request.get_json()
    
    user['name'] = json['name']
    user['age'] = json['age']
    user['email'] = json['email']


    return jsonify({
        "user": user
    })

@app.route("/api/users/<user_id>", methods=['DELETE'])
def delete_user(user_id):

    user = find_by_id_from_users(users, user_id)

    if user is None:
        return jsonify({
            "message": "存在しないユーザーです。"
        })
    
    users.remove(user)

    return jsonify({
        "user": user
    })

@app.route("/api/products", methods=['GET'])
def get_products():
    return jsonify({
        "users": products,
        "total": len(products)
    })