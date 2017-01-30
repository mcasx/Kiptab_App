# Kiptab

![Kiptab](http://i.imgur.com/1yqIrVD.png)

Developed at Porto Summer of Code 2016, a 48h hackathon set in Porto, Kiptab is an app that helps you and your friends keep track of expenses during vacations and other social settings by balancing debts automatically.

## Technologies

### Server

- Python
- Flask
- SQLite

### Client

- HTML, CSS, JavaScript
- Vue.js
- Material Design Lite

## Development

## Dependencies

```
$ cd server
$ pip install -r requirements.txt
```

## Run

```
$ cd server
$ chmod +x start.sh
$ ./start.sh
```

## Deployment

1. Clone the repository:

```
$ git clone https://github.com/faviouz/kiptab.git
$ cd kiptab/
```

2. Make sure `DEBUG=False` is set in `app.config`.

3. Run the application.

```
$ chmod +x start.sh
$ ./start.sh
```
