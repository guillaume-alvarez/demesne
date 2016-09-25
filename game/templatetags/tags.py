from django import template

register = template.Library()

@register.inclusion_tag("game/game_list_item.html")
def game_link(game,userId):
    url = ""
    if game.multiplayer:
        badgeTypeClass = "badge alert-info"
        badgeType = "MULTIPLAYER"
    else:
        badgeTypeClass = "badge"
        badgeType = "HOTSEAT"

    if game.isNotFull():
        badgeFillClass = "badge alert-success"
        if game.isUserIn(userId):
            badgeFill = "ALREADY IN"
            url = "/games/" + str(game.id)
        else:
            badgeFill = "FREE (" + str(game.placesLeft()) + ")"
            url = "/games/" + str(game.id) + "/join_game"
    elif game.winner:
        badgeFill = "FINISHED"
        badgeFillClass = "badge"
        url = "/games/" + str(game.id)
    else:
        if game.isUserIn(userId):
            badgeFill = "ALREADY IN"
        else:
            badgeFill = "FULL"
        badgeFillClass = "badge alert-danger"
        url = "/games/" + str(game.id)


    return {'url': url, 'badgeFill': badgeFill,'badgeFillClass': badgeFillClass, 'badgeType': badgeType,'badgeTypeClass': badgeTypeClass, 'name': game.name}
