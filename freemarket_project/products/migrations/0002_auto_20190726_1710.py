# Generated by Django 2.2.2 on 2019-07-26 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='googledocid',
            field=models.CharField(default='test', max_length=200),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product',
            name='seller',
            field=models.CharField(max_length=200),
        ),
    ]