# Generated by Django 5.1.5 on 2025-02-03 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email_pin',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='saved',
            field=models.ManyToManyField(blank=True, null=True, to='products.product'),
        ),
        migrations.AlterField(
            model_name='user',
            name='stripe_customer_id',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
    ]
