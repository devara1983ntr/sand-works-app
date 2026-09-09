package com.roshan.sandworks.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = BrandOrange,
    onPrimary = LightSurface,
    primaryContainer = BrandOrangeDark,
    onPrimaryContainer = BrandOrangeLight,
    secondary = BrandSandGold,
    onSecondary = DarkBackground,
    secondaryContainer = BrandSandGoldDark,
    onSecondaryContainer = BrandSandGoldLight,
    background = DarkBackground,
    onBackground = DarkOnBackground,
    surface = DarkSurface,
    onSurface = DarkOnSurface,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = DarkOnSurfaceVariant,
    outline = DarkOutline,
    error = SemanticError,
    onError = LightSurface
)

private val LightColorScheme = lightColorScheme(
    primary = BrandOrange,
    onPrimary = LightSurface,
    primaryContainer = BrandOrangeLight,
    onPrimaryContainer = BrandOrangeDark,
    secondary = BrandSandGold,
    onSecondary = DarkBackground,
    secondaryContainer = BrandSandGoldLight,
    onSecondaryContainer = BrandSandGoldDark,
    background = LightBackground,
    onBackground = LightOnBackground,
    surface = LightSurface,
    onSurface = LightOnSurface,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = LightOnSurfaceVariant,
    outline = LightOutline,
    error = SemanticError,
    onError = LightSurface
)

@Composable
fun SandWorksTheme(
    darkTheme: Boolean = true, // Dark-first per BUILD-BASELINE.md
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
