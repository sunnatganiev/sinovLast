/*

User Class									1ball = 1000sum
login: “string”
parol: “string”       ✅
ism “string”          ✅
familiya “string"     ✅
sharif “string"       ✅
tug’ilgan sana “date” ✅
jinsi “string”        ✅
telefon “string”      ✅
email “string”        ✅
profil rasm “string”  ✅
status: “enum” (Admin, Registrator, Client) ✅


——————————————————-
class Admin extends User

——————————————————-
class Registrator extends User

——————————————————-
class Client extends User

whoInvited: "email string"    ✅
followingWhom: "email string" ✅
ballBalance: number           ✅
leftForWeek: [Array]          ✅
rightForWeek: [Array]         ✅
leftForMonth: [Array]         ✅
rightForMonth: [Array]        ✅
maqom: “enum” (client, partner, master, manager) ✅

=========================================================================

Client status ✅

Client: 650ball
Partner: 1300ball
Master: 2300ball
Manager: 4300ball

=========================================================================

Taklif ✅

Client uchun 75ball
Partner uchun 150ball
Master uchun 300ball
Manager uchun 600ball

=========================================================================

BINAR

Client status: “enum” (client, partner, master, manager)                 
leftForWeek [{}, {}, {}]
rightForWeek [{}, {}, {}]

const binar = function(limit) {

		if (leftForWeek.length === 0 || rightForWeek.length === 0) return;

		if (leftForWeek.sum > rightForWeek.sum && rightForWeek.sum =< limit) 
			leftForWeek = leftForWeek.sum - rightForWeek.sum 
			ballBalance += rightForWeek.sum * 0.1
			rightForWeek.length === 0
	
		if (rightForWeek.sum > leftForWeek && leftForWeek.sum =< limit)
			rightForWeek.sum = rightForWeek.sum - leftForWeek
			ballBalance += left.sum * 0.1
			leftForWeek.length === 0
}

const day = new Date();
const dayOfTheWeek = day.getDay();


if (dayOfTheWeek === 1) {
    const users = await User.find();
	clients.forEach(client => {
		if (client status === “client”) binar(20000)
		if (client status === “partner”) binar(40000)
		if (client status === “master”) binar(80000)
		if (client status === “manager”) binar(150000)

        switch (client.status) {
            case "client":
                binar(20000)
                break;
            case "partner":
                binar(40000)
                break;
            case "master":
                binar(80000)
                break;
            case "manager":
                binar(150000)
                break;
            default:
                break;
        }
	})
}


=========================================================================
SALARY

leftForMonth: [Array]
rightForMonth: [Array]





const salary = (limit) => {
    if(user.left >= user.right && user.right >= 10000 || user.right >= user.left && user.left >= 10000) {
        const all = user.right + user.left
        if(all <= limit) {
            user.balance += (user.right + user.left) * 0.05;
        }
        if(all > limit) {
            user.balance += limit * 0.05;
        }
    }

    user.left = user.right = []
}

if (Day of the Month === 1) {
	clients.forEach(client => {
        if(client.status === 'client') return;

		if (client status === “partner”) salary(100000)
		if (client status === “master”) salary(200000)
		if (client status === “manager”) salary(400000)

        switch (client.status) {
            case "client":
                break;
            case "partner":
                salary(100000)
                break;
            case "master":
                salary(200000)
                break;
            case "manager":
                salary(400000)
                break;
            default:
                break;
        }
	})
}


*/
