-- =====================================================================
--  Jaramiyo inventory actions — client
--  Two extra actions for the inventory action menu:
--    · toggle hair  (native, no framework needed)
--    · multi-job    (bridges the NUI to the server; ESX / Qbox)
--  The server owns every multi-job decision and revalidates it, because a
--  NUI can be tampered with — the client only relays.
-- =====================================================================

-- Toggle the ped's hair on and off. Instant and fail-safe: it simply stores
-- the current hair (drawable + texture) and puts it back, so it can never get
-- stuck. Component 2 is hair; (0, 0) is the bald variation.
local savedHair

RegisterNUICallback('jrmyToggleHair', function(_, cb)
    cb(1)

    local ped = cache.ped or PlayerPedId()

    if savedHair then
        SetPedComponentVariation(ped, 2, savedHair.drawable, savedHair.texture, 0)
        savedHair = nil
    else
        savedHair = {
            drawable = GetPedDrawableVariation(ped, 2),
            texture = GetPedTextureVariation(ped, 2),
        }
        SetPedComponentVariation(ped, 2, 0, 0, 0)
    end
end)

-- Toggle a clothing piece on/off. Native and fail-safe: it stores the current
-- component/prop and puts it back, so a piece can never get stuck. Components
-- hide by drawable 0; props hide with ClearPedProp.
local CLOTHING = {
    mask = { kind = 'comp', id = 1 },
    hat = { kind = 'prop', id = 0 },
    glasses = { kind = 'prop', id = 1 },
    neck = { kind = 'comp', id = 7 },
    top = { kind = 'comp', id = 11 },
    vest = { kind = 'comp', id = 9 },
    torso = { kind = 'comp', id = 3 },
    bag = { kind = 'comp', id = 5 },
    watch = { kind = 'prop', id = 6 },
    gloves = { kind = 'comp', id = 3 },
    pants = { kind = 'comp', id = 4 },
    shoes = { kind = 'comp', id = 6 },
}
local savedClothing = {}

RegisterNUICallback('jrmyToggleClothing', function(data, cb)
    cb(1)

    local piece = CLOTHING[data.piece]
    if not piece then return end

    local ped = cache.ped or PlayerPedId()
    local saved = savedClothing[data.piece]

    if saved then
        if piece.kind == 'comp' then
            SetPedComponentVariation(ped, piece.id, saved.drawable, saved.texture, 0)
        elseif saved.drawable == -1 then
            ClearPedProp(ped, piece.id)
        else
            SetPedPropIndex(ped, piece.id, saved.drawable, saved.texture, true)
        end
        savedClothing[data.piece] = nil
    elseif piece.kind == 'comp' then
        savedClothing[data.piece] = {
            drawable = GetPedDrawableVariation(ped, piece.id),
            texture = GetPedTextureVariation(ped, piece.id),
        }
        SetPedComponentVariation(ped, piece.id, 0, 0, 0)
    else
        savedClothing[data.piece] = {
            drawable = GetPedPropIndex(ped, piece.id),
            texture = GetPedPropTextureIndex(ped, piece.id),
        }
        ClearPedProp(ped, piece.id)
    end
end)

-- Multi-job: the window asks for the list when it opens.
RegisterNUICallback('jrmyMultijobGet', function(_, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobGet', false) or { active = '', jobs = {}, max = 3 })
end)

RegisterNUICallback('jrmyMultijobSwitch', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobSwitch', false, data.job) and 1 or 0)
end)

RegisterNUICallback('jrmyMultijobLeave', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobLeave', false, data.job) and 1 or 0)
end)
