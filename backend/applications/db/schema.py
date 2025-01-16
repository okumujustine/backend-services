import graphene
from graphene_django import DjangoObjectType


from .models import DbConnectionModel


class DbConnectionModelType(DjangoObjectType):
    class Meta:
        model = DbConnectionModel
        fields = ("name", "description")


class Query(graphene.ObjectType):
    all_db_connections = graphene.List(DbConnectionModelType)

    def resolve_all_db_connections(self, _):
        return DbConnectionModel.objects.all()

schema = graphene.Schema(query=Query)