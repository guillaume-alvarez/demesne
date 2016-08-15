# Installation

Download from github then...

Make sure Python 3.5 is installed

```see https://www.python.org/downloads/release/python-352/```

Load python requirements:

```pip install -r requirements.txt```

Create local DB:

```
python manage.py migrate
python manage.py default_types
```

Start server:

```python manage.py runserver```

# Development

After modifying the models, you will need to update the migration scripts and DB instance:

```
python manage.py makemigrations game
python manage.py migrate
python manage.py default_types
```

Note: if you delete the *.py files in game/mùigrations directory it will recreate a new initial state script, which is better until the model is stabilized.